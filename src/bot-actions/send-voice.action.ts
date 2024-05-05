import { CommandHandler } from '@models';
import { ChatsMemoryStorage, Logger, Openai, prepareMessageThreadId } from '@utils';
import { InputFile } from 'grammy';

export const sendVoice: CommandHandler = async (ctx) => {
  const messageToReply = ctx.message;
  const isPmToBot = ctx.chat?.type === 'private';
  if (messageToReply) {
    const {
      message_thread_id,
      chat,
      text,
      caption,
      message_id,
      is_topic_message,
    } = messageToReply;
    const chatId = chat.id;

    /**
     * Trying to read an image attachment if message contains any.
     */
    const imageId = ctx.message?.photo?.[0].file_id;
    let captionWithDescription = caption;
    if (imageId) {
      Logger.info('User message contains image, will read it.');
      const imageDescription = await Openai.explainImage(imageId);
      captionWithDescription = (caption || '') + `, прикрепляю картинку: ${imageDescription}`;
    }


    const userMessage = text || captionWithDescription;
    if (userMessage) {
      /**
       * Leaving "bot is recording audio" chat status
       */
      ctx.api.sendChatAction(chatId, 'record_voice', {
        ...prepareMessageThreadId({
          message_thread_id,
          is_topic_message
        })
      }).catch(error => Logger.error(error.message));

      ChatsMemoryStorage.addUserMessage(chatId, userMessage);
      const chatHistory = ChatsMemoryStorage.getChat(chatId);
      const botResponse = await Openai.fetchChatMessageReply(chatHistory);
      if (botResponse) {
        ChatsMemoryStorage.addBotMessage(chatHistory.id, botResponse);
        const voiceFile = await Openai.fetchVoiceMessage(botResponse);
        if (voiceFile) {
          const inputFile = new InputFile(voiceFile);
          if (isPmToBot) {
            ctx.api.sendVoice(chatId, inputFile).catch(error => Logger.error(error.message));
          } else {
            ctx.replyWithVoice(inputFile, {
              reply_to_message_id: message_id,
              ...prepareMessageThreadId({
                message_thread_id,
                is_topic_message
              })
            }).catch(error => Logger.error(error.message));
          }
        }
      }
    }
  }
};
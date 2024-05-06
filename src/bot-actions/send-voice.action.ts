import { CommandHandler } from '@models';
import {
  ChatsMemoryStorage,
  getIsPmToBot,
  Logger,
  Openai,
  replyWithVoice,
  sendChatAction,
  sendVoice as sendVoiceToChat
} from '@utils';
import { InputFile } from 'grammy';

export const sendVoice: CommandHandler = async (ctx) => {
  Logger.command('Bot is going to send voice!');
  const messageToReply = ctx.message;
  if (messageToReply) {
    const {
      chat,
      text,
      caption,
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
      sendChatAction(ctx, 'record_voice');

      ChatsMemoryStorage.addUserMessage(chatId, userMessage);
      const chatHistory = ChatsMemoryStorage.getChat(chatId);
      const botResponse = await Openai.fetchChatMessageReply(chatHistory);
      if (botResponse) {
        ChatsMemoryStorage.addBotMessage(chatHistory.id, botResponse);
        const voiceFile = await Openai.fetchVoiceMessage(botResponse);
        if (voiceFile) {
          const inputFile = new InputFile(voiceFile);
          if (getIsPmToBot(ctx)) {
            sendVoiceToChat(ctx, inputFile);
          } else {
            replyWithVoice(ctx, inputFile);
          }
        }
      }
    }
  }
};
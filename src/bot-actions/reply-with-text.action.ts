import { CommandHandler } from '@models';
import { ChatsMemoryStorage, Logger, Openai, prepareMessageThreadId } from '@utils';

export const replyWithText: CommandHandler = async (ctx) => {
  const messageToReply = ctx.message;
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
    ctx.api.sendChatAction(chatId, 'typing', {
      ...prepareMessageThreadId({
        message_thread_id,
        is_topic_message,
      })
    }).catch(error => Logger.error(error.message));

    const imageId = ctx.message?.photo?.[0].file_id;
    let captionWithDescription = caption;
    if (imageId) {
      Logger.info('User message contains image, will read it.');
      const imageDescription = await Openai.explainImage(imageId);
      captionWithDescription = (caption || '') + `, прикрепляю картинку: ${imageDescription}`;
    }

    const userMessage = text || captionWithDescription;
    if (userMessage) {
      ChatsMemoryStorage.addMessage(chatId, { role: 'user', content: userMessage });
      const chatHistory = ChatsMemoryStorage.getChat(chatId);
      const reply = await Openai.fetchChatMessageReply(chatHistory);
      if (reply) {
        ChatsMemoryStorage.addMessage(chatId, { role: 'assistant', content: reply });
        ctx.reply(reply, {
          reply_to_message_id: message_id,
          ...prepareMessageThreadId({
            message_thread_id,
            is_topic_message,
          })
        }).catch(error => Logger.error(error.message));
      }
    }
  }
};
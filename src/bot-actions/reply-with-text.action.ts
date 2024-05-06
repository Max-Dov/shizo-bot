import { CommandHandler } from '@models';
import {
  ChatsMemoryStorage,
  getIsPmToBot,
  Logger,
  Openai,
  replyToMessage,
  sendChatAction,
  sendMessageToChat
} from '@utils';

export const replyWithText: CommandHandler = async (ctx) => {
  Logger.command('Going to reply with text!');
  const messageToReply = ctx.message;
  if (!messageToReply) {
    Logger.error('Can not extract message from context!')
    return;
  }
  const {
    chat,
    text,
    caption,
  } = messageToReply;

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
    sendChatAction(ctx, 'typing');
    const chatId = chat.id;
    ChatsMemoryStorage.addUserMessage(chatId, userMessage);
    const chatHistory = ChatsMemoryStorage.getChat(chatId);
    const reply = await Openai.fetchChatMessageReply(chatHistory);
    if (reply) {
      ChatsMemoryStorage.addBotMessage(chatId, reply);
      if (getIsPmToBot(ctx)) {
        sendMessageToChat(ctx, reply);
      } else {
        replyToMessage(ctx, reply);
      }
    }
  }
};
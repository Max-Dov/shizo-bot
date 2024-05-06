import { Context } from 'grammy';
import { Logger } from '../logger.util';

export const sendMessageToChat = (ctx: Context, message: string): void => {
  const chatId = ctx?.message?.chat?.id;
  if (!chatId) {
    Logger.error('Can not extract chatId from ctx! Not sending message to chat.');
    return;
  }
  ctx.api.sendMessage(chatId, message).catch(Logger.errorMessage);
};
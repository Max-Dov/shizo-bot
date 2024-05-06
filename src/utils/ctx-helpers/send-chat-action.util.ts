import { Context } from 'grammy';
import { Logger } from '../logger.util';
import { getMessageThreadId } from './get-message-thread-id.util';

type ActionType = Parameters<Context['api']['sendChatAction']>[1]

export const sendChatAction = (ctx: Context, action: ActionType): void => {
  const chatId = ctx?.message?.chat?.id;
  if (!chatId) {
    Logger.error('Can not extract chatId from ctx! Not sending message to chat.');
    return;
  }
  ctx.api.sendChatAction(chatId, action, {
    message_thread_id: getMessageThreadId(ctx),
  }).catch(Logger.errorMessage);
}
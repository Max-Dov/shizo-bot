import { Context } from 'grammy';
import { Logger } from '../logger.util';
import { getMessageThreadId } from './get-message-thread-id.util';

export const replyToMessage = (ctx: Context, message: string): void => {
  const messageId = ctx.message?.message_id;
  if (!messageId) {
    Logger.error('Can not extract messageId from context, can not reply to message!');
    return;
  }
  ctx.reply(message, {
    reply_to_message_id: messageId,
    message_thread_id: getMessageThreadId(ctx),
  }).catch(Logger.errorMessage);
}
import { Context } from 'grammy';
import { Message } from '@grammyjs/types';

/**
 * Telegram API will return 400 if you attach existing `message_thread_id` when `is_topic_message === false`.
 * It exists in ctx, but better be not sent in context.
 * Yeah.. also a bit of info there https://github.com/tdlib/telegram-bot-api/issues/356#issuecomment-1405378400.
 */
export const getMessageThreadId = (ctx: Context): Message['message_thread_id'] => {
  const messageThreadId = ctx.message?.message_thread_id;
  const isTopicMessage = ctx.message?.is_topic_message;
  return isTopicMessage ? messageThreadId : undefined;
}
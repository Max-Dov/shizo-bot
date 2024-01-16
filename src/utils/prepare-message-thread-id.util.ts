import { Message } from '@grammyjs/types';

interface Params {
  message_thread_id: Message['message_thread_id'],
  is_topic_message: Message['is_topic_message'],
}

/**
 * Telegram API will return 400 if you attach existing `message_thread_id` when `is_topic_message === false`.
 * Yeah.. also a bit of info there https://github.com/tdlib/telegram-bot-api/issues/356#issuecomment-1405378400.
 */
export const prepareMessageThreadId = ({ message_thread_id, is_topic_message }: Params) => ({
  message_thread_id: is_topic_message ? message_thread_id : undefined
});
import { Context } from 'grammy';
import { getMessageThreadId } from './get-message-thread-id.util';
import { Logger } from '../logger.util';

export const replyWithPhoto = (ctx: Context, imageAsString: string, caption: string) => {
  ctx.replyWithPhoto(imageAsString, {
    caption,
    message_thread_id: getMessageThreadId(ctx),
  }).catch(Logger.errorMessage);
};
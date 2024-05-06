import { Context, InputFile } from 'grammy';
import { getMessageThreadId, Logger } from '@utils';

export const replyWithVoice = (ctx: Context, inputFile: InputFile) => {
  const messageId = ctx.message?.message_id;
  if (!messageId) {
    Logger.error('Can not extract messageId from context, can not reply to message!');
    return;
  }
  ctx.replyWithVoice(inputFile, {
    reply_to_message_id: messageId,
    message_thread_id: getMessageThreadId(ctx),
  }).catch(Logger.errorMessage);
};
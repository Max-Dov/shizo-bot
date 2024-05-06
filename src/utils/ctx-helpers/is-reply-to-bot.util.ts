import { Context } from 'grammy';

export const getIsReplyToBot = (ctx: Context) => {
  const repliedToFirstName = ctx.message?.reply_to_message?.from?.first_name;
  return typeof repliedToFirstName === 'string' && repliedToFirstName === process.env.BOT_NAME;
}
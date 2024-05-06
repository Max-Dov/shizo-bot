import { Context } from 'grammy';

export const getIsPmToBot = (ctx: Context) => {
  return ctx.chat?.type === 'private';
};
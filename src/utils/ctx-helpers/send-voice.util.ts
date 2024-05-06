import { Context, InputFile } from 'grammy';
import { Logger } from '../logger.util';

export const sendVoice = (ctx: Context, inputFile: InputFile) => {
  const chatId = ctx?.message?.chat?.id;
  if (!chatId) {
    Logger.error('Can not extract chatId from ctx! Not sending message to chat.');
    return;
  }
  ctx.api.sendVoice(chatId, inputFile).catch(Logger.errorMessage);
}
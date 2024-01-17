import { Context, InputFile } from 'grammy';
import { ChatsMemoryStorage, Logger, Openai, shouldRandomlySendPainting, shouldRandomlySendVoice } from '@utils';

export const sendOwnRandomMessage = async (ctx: Context, chatId: number) => {
  const shouldSendVoice = shouldRandomlySendVoice();
  const shouldDrawPicture = shouldRandomlySendPainting();
  const chat = ChatsMemoryStorage.getChat(chatId);
  if (shouldSendVoice) {
    const message = await Openai.fetchOwnMessage();
    if (message) {
      const voiceUrl = await Openai.fetchVoiceMessage(message);
      if (voiceUrl) {
        ctx.api.sendVoice(chatId, new InputFile(voiceUrl)).catch(Logger.error);
      }
    }
  } else if (shouldDrawPicture) {
    const drawingName = await Openai.fetchDrawingName();
    if (drawingName) {
      const picture = await Openai.fetchDrawing(drawingName);
      if (picture) {
        ctx.api.sendPhoto(chatId, picture).catch(Logger.error);
      }
    }
  } else {
    const message = await Openai.fetchOwnMessage();
    if (message) {
      ctx.api.sendMessage(chatId, message).catch(Logger.error);
    }
  }
};
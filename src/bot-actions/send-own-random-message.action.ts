import { Context, InputFile } from 'grammy';
import { Logger, Openai, shouldRandomlySendPainting, shouldRandomlySendVoice } from '@utils';

export const sendOwnRandomMessage = async (api: Context['api'], chatId: number) => {
  const shouldSendVoice = shouldRandomlySendVoice();
  const shouldDrawPicture = shouldRandomlySendPainting();
  if (shouldSendVoice) {
    const message = await Openai.fetchOwnMessage();
    if (message) {
      const voiceUrl = await Openai.fetchVoiceMessage(message);
      if (voiceUrl) {
        api.sendVoice(chatId, new InputFile(voiceUrl)).catch(Logger.error);
      }
    }
  } else if (shouldDrawPicture) {
    const drawingName = await Openai.fetchDrawingName();
    if (drawingName) {
      const picture = await Openai.fetchDrawing(drawingName);
      if (picture) {
        api.sendPhoto(chatId, picture).catch(Logger.error);
      }
    }
  } else {
    const message = await Openai.fetchOwnMessage();
    if (message) {
      api.sendMessage(chatId, message).catch(Logger.error);
    }
  }
};
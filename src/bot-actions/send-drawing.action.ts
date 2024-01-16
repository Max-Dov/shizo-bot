import { CommandHandler } from '@models';
import { Openai } from '@utils';

export const sendDrawing: CommandHandler = async (ctx) => {
  const messageToReply = ctx.message;

  if (messageToReply) {
    const {
      message_thread_id,
      chat,
    } = messageToReply;
    const chatId = chat.id;
    const drawingName = await Openai.fetchDrawingName();
    if (drawingName) {
      const image = await Openai.fetchDrawing(drawingPrompt(drawingName));
      if (image) {
        ctx.api.sendChatAction(chatId, 'upload_photo', { message_thread_id });
        ctx.replyWithPhoto(image, { message_thread_id, caption: drawingName });
      }
    }
  }
};

const drawingPrompt = (drawingName: string) => `Framed detailed and expressive oil painting with name ${drawingName}.`;
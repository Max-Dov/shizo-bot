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
    ctx.api.sendChatAction(chatId, 'upload_photo', { message_thread_id });
    const drawingName = await Openai.fetchChatMessageReply('Придумай название картины');
    if (drawingName) {
      const image = await Openai.fetchDrawing(drawingName);
      if (image) {
        ctx.replyWithPhoto(image, { message_thread_id, caption: drawingName });
      }
    }
  }
};
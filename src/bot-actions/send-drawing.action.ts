import { CommandHandler } from '@models';
import { ChatsMemoryStorage, Logger, Openai, replyWithPhoto, sendChatAction } from '@utils';

export const sendDrawing: CommandHandler = async (ctx) => {
  Logger.command('Going to draw an image!');
  const messageToReply = ctx.message;
  if (!messageToReply) {
    Logger.error('Can not extract message from context!')
    return;
  }

  const drawingName = await Openai.fetchDrawingName();
  if (!drawingName) {
    Logger.error('OpenAI call did not produce drawingName!')
    return;
  }

  try {
    const image = await Openai.fetchDrawing(drawingPrompt(drawingName));
    if (image) {
      ChatsMemoryStorage.addBotMessage( messageToReply.chat.id, `Посмотрите мою картину: ${drawingName}`);
      sendChatAction(ctx, 'upload_photo');
      replyWithPhoto(ctx, image, drawingName);
    }
  } catch (error) {
    Logger.error('sendDrawing action crashed - probably due to content filters:', (error as Error).message);
  }
};

const drawingPrompt = (drawingName: string) => `${drawingName}, framed expressive oil painting`;
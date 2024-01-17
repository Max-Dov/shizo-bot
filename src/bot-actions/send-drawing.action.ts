import { CommandHandler } from '@models';
import { ChatsMemoryStorage, Logger, Openai, prepareMessageThreadId } from '@utils';

export const sendDrawing: CommandHandler = async (ctx) => {
  const messageToReply = ctx.message;

  if (messageToReply) {
    const {
      message_thread_id,
      is_topic_message,
      chat,
    } = messageToReply;
    const chatId = chat.id;
    ctx.api.sendChatAction(chatId, 'upload_photo', {
      ...prepareMessageThreadId({
        message_thread_id,
        is_topic_message
      })
    }).catch(error => Logger.error(error.message));

    const drawingName = await Openai.fetchDrawingName();
    if (drawingName) {
      try {
        const image = await Openai.fetchDrawing(drawingPrompt(drawingName));
        if (image) {
          ctx.api.sendChatAction(chatId, 'upload_photo', {
            ...prepareMessageThreadId({
              message_thread_id,
              is_topic_message
            })
          }).catch(error => Logger.error(error.message));
          ChatsMemoryStorage.addMessage(chatId, { role: 'assistant', content: `Прикрепляю мою картину: ${drawingName}` });
          ctx.replyWithPhoto(image, {
            caption: drawingName,
            ...prepareMessageThreadId({
              message_thread_id,
              is_topic_message
            })
          }).catch(error => Logger.error(error.message));
        }
      } catch (error) {
        Logger.error('sendDrawing action crashed - probably due to content filters:', (error as Error).message);
      }
    }
  }
};

const drawingPrompt = (drawingName: string) => `Framed detailed and expressive oil painting with name ${drawingName}.`;
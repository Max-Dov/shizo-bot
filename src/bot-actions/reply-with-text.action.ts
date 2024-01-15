import { CommandHandler } from '@models';
import { Logger, Openai, Replicateai } from '@utils';

export const replyWithText: CommandHandler = async (ctx) => {
  const messageToReply = ctx.message;
  if (messageToReply) {
    const {
      message_thread_id,
      chat,
      text,
      caption,
      message_id,
    } = messageToReply;
    const chatId = chat.id;

    const imageId = ctx.message?.photo?.[0].file_id;
    let captionWithDescription = caption;
    if (imageId) {
      Logger.info('User message contains image, will read it.');
      const imageDescription = await Replicateai.explainImage(imageId);
      captionWithDescription = (caption || '') + `, прикрепляю картинку: ${imageDescription}`;
    }
    Logger.info(captionWithDescription)

    ctx.api.sendChatAction(chatId, 'typing', { message_thread_id });
    const userMessage = text || captionWithDescription;
    if (userMessage) {
      const reply = await Openai.fetchChatMessageReply(userMessage);
      ctx.reply(reply || 'Чета мне не хорошо..', { message_thread_id, reply_to_message_id: message_id });
    } else {
      ctx.reply('Чё?', { message_thread_id, reply_to_message_id: message_id });
    }
  }
};
import { CommandHandler } from '@models';
import { Logger, Openai, Replicateai } from '@utils';
import { InputFile } from 'grammy';

export const sendVoice: CommandHandler = async (ctx) => {
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
    ctx.api.sendChatAction(chatId, 'record_voice', { message_thread_id });

    const imageId = ctx.message?.photo?.[0].file_id;
    let captionWithDescription = caption;
    if (imageId) {
      Logger.info('User message contains image, will read it.')
      const imageDescription = await Replicateai.explainImage(imageId);
      captionWithDescription = (caption || '') + `, прикрепляю картинку: ${imageDescription}`;
    }

    const userMessage = text || captionWithDescription;
    if (userMessage) {
      const voiceFile = await Openai.fetchVoiceMessage(userMessage);
      ctx.replyWithVoice(new InputFile(voiceFile), { message_thread_id, reply_to_message_id: message_id });
    } else {
      ctx.reply('Чё?', { message_thread_id, reply_to_message_id: message_id });
    }
  }
};
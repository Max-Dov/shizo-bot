import { CommandHandler } from '@models';
import { Openai } from '@utils';
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
    if (text || caption) {
      const voiceFile = await Openai.fetchVoiceMessage((text || caption) as string);
      ctx.replyWithVoice(new InputFile(voiceFile), { message_thread_id, reply_to_message_id: message_id });
    } else {
      ctx.reply('Чё?', { message_thread_id, reply_to_message_id: message_id });
    }
  }
};
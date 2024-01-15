import { CommandHandler } from '@models';
import { Openai } from '@utils';

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
    ctx.api.sendChatAction(chatId, 'typing', { message_thread_id });
    if (text || caption) {
      const reply = await Openai.fetchChatMessageReply((text || caption) as string);
      ctx.reply(reply || 'Чета мне не хорошо..', { message_thread_id, reply_to_message_id: message_id });
    } else {
      ctx.reply('Чё?', { message_thread_id, reply_to_message_id: message_id });
    }
  }
};
import { Openai, prepareBotCommandAction } from '@utils';
import { ChatCommands } from '@constants';
import { BotCommandAction } from '@models';

export const prepareDivination = (): BotCommandAction => prepareBotCommandAction(
  ChatCommands.DIVINATION,
  async (ctx) => {
    const chatId = ctx.chat?.id;
    const userName = ctx.message?.from.first_name;
    const messageThreadId = ctx.message?.message_thread_id;
    if (chatId) {
      ctx.api.sendChatAction(chatId, 'typing', { message_thread_id: messageThreadId });
      const divinationText = await Openai.fetchDivination();
      ctx.api.sendMessage(
        chatId,
        divinationText || 'Чета мне нехорошо..',
        { message_thread_id: messageThreadId, }
      );
    }
  }
);
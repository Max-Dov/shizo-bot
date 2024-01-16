import { Logger, Openai, prepareBotCommandAction, prepareMessageThreadId } from '@utils';
import { ChatCommands } from '@constants';
import { BotCommandAction } from '@models';

export const prepareDivination = (): BotCommandAction => prepareBotCommandAction(
  ChatCommands.DIVINATION,
  async (ctx) => {
    const chatId = ctx.chat?.id;
    const messageThreadId = ctx.message?.message_thread_id;
    const isTopicMessage = ctx.message?.is_topic_message;
    if (chatId) {
      ctx.api.sendChatAction(chatId, 'typing', {
        ...prepareMessageThreadId({
          message_thread_id: messageThreadId,
          is_topic_message: isTopicMessage,
        })
      })
        .catch(error => Logger.error(error.message));
      const divinationText = await Openai.fetchDivination();
      ctx.api.sendMessage(
        chatId,
        divinationText || 'Чета мне нехорошо..',
        {
          ...prepareMessageThreadId({
            message_thread_id: messageThreadId,
            is_topic_message: isTopicMessage,
          })
        }
      ).catch(error => Logger.error(error.message));
    }
  }
);
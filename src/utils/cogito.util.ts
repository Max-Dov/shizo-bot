import { Context } from 'grammy';
import { sendOwnRandomMessage } from '../bot-actions/send-own-random-message.action';
import { Logger } from './logger.util';
import { ChatsMemoryStorage } from './chats-memory-storage.util';

// todo come up with better naming

/**
 * Util that allows bot to post messages on its own behalf.
 */
export class Cogito {
  static ctx: Context | null = null;

  static initialize = () => {
    const intervalInMinutes = Number(process.env.MINUTES_INTERVAL_TO_SEND_OWN_MESSAGES);
    const chanceToSendMessage = Number(process.env.CHANCE_TO_SEND_OWN_MESSAGE);
    if (!isNaN(intervalInMinutes) && !isNaN(chanceToSendMessage)) {
      // todo lmao when to clean interval?
      setInterval(async () => {
        for (const chatId of Object.keys(ChatsMemoryStorage.chats)) {
          if (Cogito.ctx !== null && Math.random() < chanceToSendMessage) {
            Logger.info(`Bot will send random message to ${chatId}!`);
            await sendOwnRandomMessage(Cogito.ctx, Number(chatId));
            Logger.info('Bot did send random message!');
          }
        }
      }, intervalInMinutes * 60 * 1000);
    }
  };
}
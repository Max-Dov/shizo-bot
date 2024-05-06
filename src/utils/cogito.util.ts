import { Context } from 'grammy';
import { sendOwnRandomMessage } from '../bot-actions/send-own-random-message.action';
import { Logger } from './logger.util';
import { ChatsMemoryStorage } from './chats-memory-storage.util';

/**
 * Util that allows bot to post messages on its own behalf.
 */
export class Cogito {
  static api: Context['api'] | null = null;

  static initialize = () => {
    const intervalInMinutes = Number(process.env.MINUTES_INTERVAL_TO_SEND_OWN_MESSAGES);
    const chanceToSendMessage = Number(process.env.CHANCE_TO_SEND_OWN_MESSAGE);
    if (!isNaN(intervalInMinutes) && !isNaN(chanceToSendMessage)) {
      // todo lmao when to clean interval?
      Logger.info('Setting up setInterval to post own messages.');
      setInterval(async () => {
        if (Cogito.api !== null) {
          for (const chatId of Object.keys(ChatsMemoryStorage.chats)) {
            if (Math.random() < chanceToSendMessage) {
              Logger.info(`Bot will send random message to ${chatId}!`);
              await sendOwnRandomMessage(Cogito.api, Number(chatId));
              Logger.info('Bot did send random message!');
            }
          }
        }
      }, intervalInMinutes * 60 * 1000);
    }
  };
}
import { configDotenv } from 'dotenv';
import { Bot } from 'grammy';
import { Logger, Storage } from '@utils';
import { ChatCommands } from '@constants';
import { getRedErrorMessage } from './utils/get-red-error-message.util';

const startTime = new Date().getTime();
let isStartupSuccessful = true;

/**
 * Loading environment variables into app.
 */
configDotenv({
  // uncomment below if you don't have .env.local file
  // path: './config/.env.default'
  path: './config/.env.local',
});

const envVariableSuccessIndicator = process.env.TEST_ENV_VARIABLE_HINT;
if (envVariableSuccessIndicator) {
  Logger.goodInfo('Env variables:', envVariableSuccessIndicator);
} else {
  Logger.error('Env variables: not loaded, check ~/config/README.MD for guidance.');
  isStartupSuccessful = false;
}

/**
 * Loading or creating highly efficient persistent JSON database from disc.
 */
const storageInitPromise = Storage.loadStorage()
  .then(() => Logger.goodInfo('JSON storage: loaded!'))
  .catch((error) => {
    Logger.error('JSON storage initialization/load failed.', error);
    isStartupSuccessful = false;
  });

Promise.all([
  storageInitPromise,
])
  .then(() => {
    /**
     * Declaring bot protocols.
     */
    let bot: Bot;
    try {
      if (isStartupSuccessful) {
        bot = new Bot(process.env.BOT_TOKEN || '');
        bot.api.setMyCommands([
          { command: ChatCommands.HOROSCOPE, description: 'Предскажи мой день?' },
        ]);
        bot.on('message', () => {
          Logger.info('Some message just passing by.');
        });
        bot.catch((error) => {
          Logger.error('Bot unexpected error!', getRedErrorMessage(error));
        });
        Logger.goodInfo('Bot protocols: declared!');
      }
    } catch (error) {
      Logger.error('Encountered error while initializing bot protocols:', getRedErrorMessage(error));
      isStartupSuccessful = false;
    } finally {
      /**
       * Waking up bot.
       */
      if (isStartupSuccessful) {
        bot!.start().catch((error) => {
          Logger.error('Bot unexpected error!', getRedErrorMessage(error));
        });
        Logger.goodInfo('Bot status: ready and working!');
        Logger.info('Bot started in', new Date().getTime() - startTime, 'ms');
      } else {
        Logger.error('Startup was not successful thus bot was not started with broken config to prevent unexpected damage.');
      }
    }
  });
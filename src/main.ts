import { configDotenv } from 'dotenv';
import { Bot } from 'grammy';
import { ChatgptPresets, Logger, Openai, Storage } from '@utils';
import { ChatCommands } from '@constants';
import { getRedErrorMessage } from './utils/get-red-error-message.util';
import { giveRandomAnswer, prepareDivination } from '@bot-actions';
import { shouldRandomlyReact, shouldRandomlyRespond } from './utils/should-randomly-respond.util';
import { giveReaction } from './bot-actions/give-reaction.action';

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

Openai.initialize();
Logger.goodInfo('Openai client: created!');

/**
 * Loading or creating highly efficient persistent JSON database from disc.
 */
const storageInitPromise = Storage.loadStorage()
  .then(() => Logger.goodInfo('JSON storage: loaded!'))
  .catch((error) => {
    Logger.error('JSON storage initialization/load failed.', error);
    isStartupSuccessful = false;
  });

const chatgptPresetsPromise = ChatgptPresets.loadPresetsFile('./config/chatgpt-presets.local.json')
  .then(() => Logger.goodInfo('Chatgpt presets: loaded!'))
  .catch((error) => {
    Logger.error('Chatgpt presets file load failed.', error);
    isStartupSuccessful = false;
  });


Promise.all([
  storageInitPromise,
  chatgptPresetsPromise,
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
          { command: ChatCommands.DIVINATION, description: 'Предскажи мой день?' },
        ]);
        bot.command(...prepareDivination());
        if (process.env.BOT_NAMES_REGEXP) {
          bot.hears(new RegExp(process.env.BOT_NAMES_REGEXP), (ctx) => {
            Logger.command('Bot hears its name!');
            giveRandomAnswer(ctx);
          });
        }
        bot.on('message', (ctx) => {
          Logger.info('Some message just passing by.');
          const repliedToFirstName = ctx.message.reply_to_message?.from?.first_name;
          const isReplyToBot = repliedToFirstName === process.env.BOT_NAME;
          const shouldRespond = shouldRandomlyRespond();
          const shouldLeaveReaction = shouldRandomlyReact();
          if (shouldRespond || isReplyToBot) {
            Logger.command('But bot has something to say!', { shouldRespond, isReplyToBot });
            giveRandomAnswer(ctx);
          }
          if (shouldLeaveReaction) {
            Logger.command('Bot wants to react!', { shouldLeaveReaction });
            giveReaction(ctx);
          }
        });
        bot.catch((error) => {
          Logger.error('Bot got an unexpected error!', getRedErrorMessage(error));
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
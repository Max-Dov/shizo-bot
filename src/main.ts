import { configDotenv } from 'dotenv';
import { Bot } from 'grammy';
import {
  ChatgptPresets,
  Logger,
  Openai,
  getRedErrorMessage, Cogito, logEnvVariables,
} from '@utils';
import { ChatCommands } from '@constants';
import { prepareDivination, considerAnsweringOnMessageAction } from '@bot-actions';

const startTime = new Date().getTime();
let isStartupSuccessful = true;
Logger.logTimeZone();

/**
 * Loading environment variables into app.
 */
configDotenv({ path: './.env.local' });
const envVariableSuccessIndicator = process.env.TEST_ENV_VARIABLE_HINT;
if (envVariableSuccessIndicator) {
  Logger.goodInfo('Env variables:', envVariableSuccessIndicator);
} else {
  Logger.error('Env variables: not loaded, check ~/config/README.MD for guidance.');
  isStartupSuccessful = false;
}

if (isStartupSuccessful) {
  Openai.initialize();
  Logger.goodInfo('OpenAI client: created!');
}

if (isStartupSuccessful) {
  Cogito.initialize();
  Logger.goodInfo('Bot Cogito service: initialized!');
}

/**
 * Loading chatgpt prompt presets.
 */
try {
  await ChatgptPresets.loadPresetsFile('./chatgpt-presets.local.json');
  Logger.goodInfo('Chatgpt presets: loaded!');
} catch (error) {
  Logger.error('Chatgpt presets file load failed.', getRedErrorMessage(error));
  isStartupSuccessful = false;
}

/**
 * Declaring bot protocols.
 */
let bot: Bot;
const botName = new RegExp(process.env.BOT_NAMES_REGEXP as string, 'i');
try {
  if (isStartupSuccessful) {
    bot = new Bot(process.env.BOT_TOKEN || '');
    bot.api.setMyCommands([
      { command: ChatCommands.DIVINATION, description: 'Предскажи мой день?' },
    ]);
    bot.command(...prepareDivination());
    bot.hears(botName, considerAnsweringOnMessageAction({isHearingBotName: true}));
    bot.on('message', considerAnsweringOnMessageAction({isHearingBotName: false}));
    bot.catch((error) => {
      Logger.error('Bot got an unexpected error!', getRedErrorMessage(error));
    });
    Logger.goodInfo('Bot protocols: declared!');
  }
} catch (error) {
  Logger.error('Encountered error while initializing bot protocols:', getRedErrorMessage(error));
  isStartupSuccessful = false;
}

/**
 * Waking up bot.
 */
try {
  if (isStartupSuccessful) {
    bot!.start();
    Logger.goodInfo('Bot status: ready and working!');
    Logger.info('Startup time:', new Date().getTime() - startTime, 'ms');
    logEnvVariables();
  }
} catch (error) {
  Logger.error('Bot unexpected error!', getRedErrorMessage(error));
}

if (!isStartupSuccessful) {
  Logger.error('Startup was not successful. Bot was not started with broken config to prevent unexpected damage.');
}
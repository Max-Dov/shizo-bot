import { Logger, prepareBotCommandAction } from '@utils';
import { ChatCommands } from '@constants';
import { BotCommandAction } from '@models';

export const prepareHoroscope = (): BotCommandAction => prepareBotCommandAction(
  ChatCommands.HOROSCOPE,
  (ctx) => {
    Logger.info('eh??')
  }
)
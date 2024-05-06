import { BotCommandAction } from '@models';
import { prepareBotCommandAction } from '@utils';
import { ChatCommands } from '@constants';
import { sendDrawing } from './send-drawing.action';

export const drawImage = (): BotCommandAction => prepareBotCommandAction(
  ChatCommands.DRAW_IMAGE,
  sendDrawing,
)
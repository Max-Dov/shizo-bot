import { BotCommandAction } from '@models';
import { prepareBotCommandAction } from '@utils';
import { ChatCommands } from '@constants';
import { sendVoice } from './send-voice.action';

export const voiceMessage = ():BotCommandAction => prepareBotCommandAction(
  ChatCommands.VOICE_MESSAGE,
  sendVoice,
)
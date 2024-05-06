import { CommandHandler } from '@models';
import {
  ChatsMemoryStorage,
  Cogito, getIsPmToBot, getIsReplyToBot,
  Logger, Openai,
  shouldRandomlyReact,
  shouldRandomlyRespond,
  shouldRandomlySendPainting,
  shouldRandomlySendVoice
} from '@utils';
import { replyWithText, giveReaction, sendVoice, sendDrawing } from '@bot-actions';

type Props = { isHearingBotName: boolean };

export const considerAnsweringOnMessageAction = ({ isHearingBotName }: Props): CommandHandler =>
  async (ctx) => {
    Cogito.api = ctx.api;
    const isReplyToBot = getIsReplyToBot(ctx);
    const isPmToBot = getIsPmToBot(ctx);
    const shouldSendText = shouldRandomlyRespond();
    const shouldLeaveReaction = shouldRandomlyReact();
    const shouldSendVoice = shouldRandomlySendVoice();
    const shouldDrawPicture = shouldRandomlySendPainting();
    {
      Logger.debug(
        'Message just passing by.', 'Bot electrochemistry:', {
          isHearingBotName,
          isReplyToBot,
          isPmToBot,
          shouldSendText,
          shouldSendVoice,
          shouldLeaveReaction,
          shouldDrawPicture,
        }
      );
    }
    if (isPmToBot || isHearingBotName || isReplyToBot) {
      const chatId = ctx.chat?.id;
      if (chatId) {
        const messageTypeBotDecision = await Openai.fetchAnswerType(
          ChatsMemoryStorage.getChat(chatId)
        );
        if (messageTypeBotDecision === 'voice') {
          sendVoice(ctx);
        } else {
          replyWithText(ctx);
        }
      }
    } else if (shouldSendText) {
      replyWithText(ctx);
    } else if (shouldSendVoice) {
      sendVoice(ctx);
    }
    if (shouldLeaveReaction) {
      giveReaction(ctx);
    }
    if (shouldDrawPicture) {
      sendDrawing(ctx);
    }
  };
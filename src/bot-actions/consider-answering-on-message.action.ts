import { CommandHandler } from '@models';
import {
  ChatsMemoryStorage,
  Cogito,
  Logger, Openai,
  shouldRandomlyReact,
  shouldRandomlyRespond,
  shouldRandomlySendPainting,
  shouldRandomlySendVoice
} from '@utils';
import { replyWithText, giveReaction, sendVoice, sendDrawing } from '@bot-actions';

export const considerAnsweringOnMessageAction =
  ({ isHearingBotName }: { isHearingBotName: boolean }): CommandHandler =>
    async (ctx) => {
      Cogito.ctx = ctx; // todo pass only ctx.api instead??
      const repliedToFirstName = ctx.message?.reply_to_message?.from?.first_name;
      const isReplyToBot = repliedToFirstName === process.env.BOT_NAME;
      const shouldSendText = shouldRandomlyRespond();
      const shouldLeaveReaction = shouldRandomlyReact();
      const shouldSendVoice = shouldRandomlySendVoice();
      const shouldDrawPicture = shouldRandomlySendPainting();
      const isPmToBot = ctx.chat?.type === 'private';
      {
        const username = ctx.from?.username;
        const firstName = ctx.from?.first_name; // in case user set profile to private
        Logger.info(
          'Message from', { username, firstName }, 'just passing by.',
          'Bot electrochemistry:', {
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
          const chat = ChatsMemoryStorage.getChat(chatId)
          const messageTypeBotDecision = await Openai.fetchAnswerType(chat);
          if (messageTypeBotDecision === 'voice') {
            Logger.command('Bot is going to send voice!');
            sendVoice(ctx);
          } else {
            Logger.command('Bot is going to reply with text!');
            replyWithText(ctx);
          }
        }
      } else if (shouldSendText || shouldSendVoice) {
        if (shouldSendVoice) {
          Logger.command('Bot is going to send voice!');
          sendVoice(ctx);
        } else {
          Logger.command('Bot is going to reply with text!');
          replyWithText(ctx);
        }
      }
      if (shouldLeaveReaction) {
        Logger.command('Bot is going to leave reaction!');
        giveReaction(ctx);
      }
      if (shouldDrawPicture) {
        Logger.command('Bot is going to draw picture!');
        sendDrawing(ctx);
      }
    };
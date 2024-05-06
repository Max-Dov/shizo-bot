import { CommandHandler } from '@models';
import { Logger, Openai, sendChatAction } from '@utils';
import { ReactionTypeEmoji } from '@grammyjs/types';

const allowedEmojis: string = '👍👎❤🔥🥰👏😁🤔🤯😱🤬😢🎉🤩🤮💩🙏👌🕊🤡🥱🥴😍🐳❤‍🔥🌚🌭💯🤣⚡🍌🏆💔🤨😐🍓🍾💋🖕😈😴😭🤓👻👨‍💻👀🎃🙈😇😨🤝✍🤗🫡🎅🎄☃💅🤪🗿🆒💘🙉🦄😘💊🙊😎👾🤷‍♂🤷🤷‍♀😡';

export const giveReaction: CommandHandler = async (ctx) => {
  Logger.command('Going to leave reaction!');
  const messageToReply = ctx.message;

  if (messageToReply) {
    const {
      text,
    } = messageToReply;
    sendChatAction(ctx, 'choose_sticker');
    if (!text) {
      Logger.info('Message with no text - would not send reaction');
      return;
    }
    let replyReaction = await Openai.fetchChatMessageReaction(text);
    if (!replyReaction) {
      replyReaction = '🗿';
    } else if (replyReaction.length > 2) {
      Logger.warning('Openai sent invalid reaction suggestion', { replyReaction });
      replyReaction = '🗿';
    } else if (allowedEmojis.indexOf(replyReaction) === -1) {
      Logger.warning('Openai sent reaction outside of allowed reactions set.', { replyReaction });
      replyReaction = '🗿';
    }
    ctx.react(replyReaction as ReactionTypeEmoji['emoji'])
      .catch(error => Logger.error(error.message));

  }
};
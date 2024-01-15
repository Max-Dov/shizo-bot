import { CommandHandler } from '@models';
import { Logger, Openai } from '@utils';
import { ReactionTypeEmoji } from '@grammyjs/types';

const allowedEmojis: string = '👍👎❤🔥🥰👏😁🤔🤯😱🤬😢🎉🤩🤮💩🙏👌🕊🤡🥱🥴😍🐳❤‍🔥🌚🌭💯🤣⚡🍌🏆💔🤨😐🍓🍾💋🖕😈😴😭🤓👻👨‍💻👀🎃🙈😇😨🤝✍🤗🫡🎅🎄☃💅🤪🗿🆒💘🙉🦄😘💊🙊😎👾🤷‍♂🤷🤷‍♀😡';

export const giveReaction: CommandHandler = async (ctx) => {
  const messageToReply = ctx.message;

  if (messageToReply) {
    const {
      message_thread_id,
      chat,
      text,
    } = messageToReply;
    const chatId = chat.id;
    ctx.api.sendChatAction(chatId, 'choose_sticker', { message_thread_id });
    if (text) {
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
      ctx.react(replyReaction as ReactionTypeEmoji['emoji']);
    } else {
      Logger.info('Message with no text - would not send reaction');
    }
  }
};
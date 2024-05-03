import { Chat, ChatMessage } from '@models';

/**
 * Simple util to store chat messages so bot won't lose context.
 * It is not done via persistent storage in order to keep private messages nowhere but in application memory.
 */
export class ChatsMemoryStorage {
  static chats: {
    [key in Chat['id']]?: Chat;
  } = {};

  static addMessage = (chatId: number, message: ChatMessage) => {
    let chat = ChatsMemoryStorage.chats[chatId];
    if (!chat) {
      chat = { id: chatId, messages: [] };
      ChatsMemoryStorage.chats[chatId] = chat;
    }
    const numberOfMessagesToKeep = Number(process.env.NUMBER_OF_MESSAGES_IN_MEMORY)
    chat.messages = chat.messages.slice(numberOfMessagesToKeep - 1).concat(message);
  };

  static getChat = (chatId: number) => {
    let chat = ChatsMemoryStorage.chats[chatId];
    if (!chat) {
      chat = { id: chatId, messages: [] };
      ChatsMemoryStorage.chats[chatId] = chat;
    }
    return chat;
  }
}
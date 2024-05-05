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
    // todo summarize every 10 messages over NUMBER_OF_MESSAGES_IN_MEMORY limit
    const numberOfMessagesToKeep = Number(process.env.NUMBER_OF_MESSAGES_IN_MEMORY);
    chat.messages = chat.messages.slice(numberOfMessagesToKeep - 1).concat(message);
  };

  static addUserMessage = (chatId: number, content: string) => {
    ChatsMemoryStorage.addMessage(chatId, { content, role: 'user' });
  };

  static addBotMessage = (chatId: number, content: string) => {
    ChatsMemoryStorage.addMessage(chatId, { content, role: 'assistant' });
  };

  static updateContext = (chatId: number, newContext: string) => {
    let chat = ChatsMemoryStorage.chats[chatId];
    if (!chat) {
      chat = {id: chatId, messages: []};
      ChatsMemoryStorage.chats[chatId] = chat;
    }
    chat.context = newContext;
  }

  static getChat = (chatId: number) => {
    let chat = ChatsMemoryStorage.chats[chatId];
    if (!chat) {
      chat = { id: chatId, messages: [] };
      ChatsMemoryStorage.chats[chatId] = chat;
    }
    return chat;
  };
}
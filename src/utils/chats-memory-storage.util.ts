type Chats = {
  [key in number]?: Chat;
}

// TODO move to proper file
export interface Chat {
  id: number;
  messages: Array<Message>;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Simple util to store chat messages so bot won't lose context.
 * It is not done via persistent storage in order to keep private messages nowhere but in application memory.
 */
export class ChatsMemoryStorage {
  static chats: Chats = {};

  static addMessage = (chatId: number, message: Message) => {
    let chat = ChatsMemoryStorage.chats[chatId];
    if (!chat) {
      chat = { id: chatId, messages: [] };
      ChatsMemoryStorage.chats[chatId] = chat;
    }
    chat.messages.push(message);
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
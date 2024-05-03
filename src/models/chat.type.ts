/**
 * Model describing chat instances that ChatsMemoryStorage operates with.
 */
export interface Chat {
  id: number;
  messages: Array<ChatMessage>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
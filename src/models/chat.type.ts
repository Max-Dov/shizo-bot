/**
 * Model describing chat instances that ChatsMemoryStorage operates with.
 */
export interface Chat {
  id: number;
  messages: Array<ChatMessage>;
  /**
   * Chat context summarized by ChatGPT.
   */
  context?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
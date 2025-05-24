export interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastActive: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'contact';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}
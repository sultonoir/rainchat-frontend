export type Session = {
  id: string;
  name: string;
  username: string;
  image: string;
};

export type GlobalMessageError = {
  name: string;
  message: string;
};

export type GlobalResponse = {
  data?: unknown;
  error?: unknown;
};

export type Chatlist = {
  id: string;
  name: string;
  image: string;
  lastMessage: string;
  unreadCount: number;
  lastSent: Date;
  isGroup: boolean;
  userId?: string;
};

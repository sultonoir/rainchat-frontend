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

export type Member = {
  user: {
    image: string;
    username: string;
    status: string | null;
    lastSeen: Date;
    baner: string | null;
  };
  userId: string;
  name: string | null;
  id: string;
};

export type ChatWithMember = {
  member: Member[];
  name: string;
  image: string;
  desc: string;
  id: string;
  isGroup: boolean;
  lastOnline: Date | undefined;
  userId?: string;
  invitedCode: string;
};

export type Message = {
  createdAt: Date;
  content: string | null;
  id: string;
  chatId: string;
  updatedAt: Date;
  senderId: string;
  replyToId: string | null;
};

export type Media = {
  id: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
  caption: string;
  messageId: string;
};

export type ReplyTo = Message & {
  media: Media[];
  sender: {
    name: string;
    image: string;
  };
};

export type Messages = {
  createdAt: Date;
  content: string | null;
  id: string;
  chatId: string;
  senderId: string;
  replyToId: string | null;
  replyTo: ReplyTo | null;
  media: Media[];
  sender: {
    name: string;
    image: string;
  };
};

export type MessagesPage = {
  messages: Messages[];
  nextCursor: string | null;
};

export type SendMessage = {
  media: string[];
  chatId: string;
  senderId: string;
  content?: string | undefined;
  replyToId?: string | undefined;
};

export type User = {
  name: string;
  image: string;
  id: string;
  username: string;
  baner: string;
  status: string | null;
};

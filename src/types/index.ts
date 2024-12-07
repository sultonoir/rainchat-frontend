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
  members: Member[];
  name: string;
  image: string;
  desc: string;
  id: string;
  isGroup: boolean;
  lastOnline: Date | undefined;
  userId?:string;
};

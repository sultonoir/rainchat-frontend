import { Chatlist } from "@/types";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useWebSocket } from "@/provider/socket-provider";
import { UserAvatar } from "../user/user-avatar";
import { fromNow } from "@/lib/from-now";
import Link from "next/link";

interface Props {
  chat: Chatlist;
}

export const ChatListCard = ({ chat }: Props) => {
  const { onlineUsers } = useWebSocket();
  const online = onlineUsers.includes(chat.userId ?? "");
  return (
    <div className="flex py-2 first:pt-0 last:pb-0">
      <Link
        href={`/chat/${chat.id}`}
        className="flex w-full gap-2 rounded-lg p-2 hover:bg-accent/50"
      >
        {chat.isGroup ? (
          <Avatar className="flex-none flex-shrink-0">
            <AvatarImage src={chat.image} className="size-full object-cover" />
            <AvatarFallback>{chat.name.at(0)}</AvatarFallback>
          </Avatar>
        ) : (
          <UserAvatar online={online} />
        )}
        <div className="flex flex-1 flex-col">
          <div className="flex w-full items-center justify-between">
            <h3 className="line-clamp-1">{chat.name}</h3>
            <p className="text-xs text-muted-foreground">
              {fromNow(new Date(chat.lastSent))}
            </p>
          </div>
          <div className="flex w-full items-center justify-between">
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {chat.lastMessage}
            </p>
            {chat.unreadCount > 0 && (
              <p className="rounded-lg bg-primary/10 px-2 py-1 text-xs text-primary">
                {chat.unreadCount < 99 ? chat.unreadCount : "99+"}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

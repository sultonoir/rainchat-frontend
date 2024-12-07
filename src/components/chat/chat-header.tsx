"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Users } from "lucide-react";
import useShow from "@/hooks/use-show";
import { ChatWithMember } from "@/types";
import { UserAvatar } from "../user/user-avatar";
import { Input } from "../ui/input";
import { SidebarTrigger } from "../sidebar/sidebar-trigger";
import { useWebSocket } from "@/provider/socket-provider";
import { fromNow } from "@/lib/from-now";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  chat: ChatWithMember;
}

export const ChatHeader = ({ chat, className }: Props) => {
  const { setShow } = useShow();
  const { onlineUsers } = useWebSocket();
  const online = onlineUsers.includes(chat.userId ?? "");
  return (
    <div className={cn("border-b border-border/40 p-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          {chat.isGroup ? (
            <Avatar className="flex-none flex-shrink-0">
              <AvatarImage
                src={chat.image}
                className="size-full object-cover"
              />
              <AvatarFallback>{chat.name.at(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <UserAvatar online={online} />
          )}
          <div className="flex flex-1 flex-col">
            <h3 className="line-clamp-1">{chat.name}</h3>
            {chat.isGroup ? (
              <p>{chat.desc}</p>
            ) : (
              <p>{fromNow(new Date(chat.lastOnline ?? new Date()))}</p>
            )}
          </div>
        </div>
        <div className="flex flex-none flex-shrink-0 gap-2">
          {/* //!!todo */}
          <Input placeholder="search..." />
          <Button
            onClick={setShow}
            size="icon"
            className="flex-none flex-shrink-0 rounded-full hover:bg-primary/10 hover:text-primary"
            variant="ghost"
          >
            <Users />
          </Button>
        </div>
      </div>
    </div>
  );
};

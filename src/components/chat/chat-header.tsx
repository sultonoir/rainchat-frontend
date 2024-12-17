"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import { Search, Users } from "lucide-react";
import useShow from "@/hooks/use-show";
import { ChatWithMember } from "@/types";
import { UserAvatar } from "../user/user-avatar";
import { Input } from "../ui/input";
import { SidebarTrigger } from "../sidebar/sidebar-trigger";
import { useWebSocket } from "@/provider/socket-provider";
import { fromNow } from "@/lib/from-now";
import { CustomImage } from "../ui/custom-image";
import { CopyButton } from "../ui/copy-button";

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
            <div className="flex items-center gap-2">
              <CustomImage src={chat.image} name={chat.name} />
              <div className="flex flex-1 flex-col">
                <h3 className="line-clamp-1">{chat.name}</h3>
                <p className="text-xs text-muted-foreground">{chat.desc}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <UserAvatar online={online} src={chat.image} />
              <div className="flex flex-1 flex-col">
                <h3 className="line-clamp-1">{chat.name}</h3>
                {online ? (
                  <p className="text-xs text-muted-foreground">Online</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {fromNow(new Date(chat.lastOnline ?? new Date()))}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-none flex-shrink-0 gap-2">
          {/* //!!todo */}
          <Input placeholder="search..." className="hidden md:flex" />
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-primary/10 hover:text-primary md:hidden"
          >
            <Search />
          </Button>
          {chat.isGroup && (
            <>
              <CopyButton code={chat.invitedCode} />
              <Button
                onClick={setShow}
                size="icon"
                className="flex-none flex-shrink-0 rounded-full hover:bg-primary/10 hover:text-primary"
                variant="ghost"
              >
                <Users />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import { Search, Users } from "lucide-react";
import useShow from "@/hooks/use-show";
import { ChatWithMember } from "@/types";
import { UserAvatar } from "../user/user-avatar";
import { SidebarTrigger } from "../sidebar/sidebar-trigger";
import { useWebSocket } from "@/provider/socket-provider";
import { CustomImage } from "../ui/custom-image";
import { CopyButton } from "../ui/copy-button";
import { SearchInput } from "../search/search-input";
import { useSeacrch } from "@/hooks/use-search-dialog";
import { LastOnline } from "../ui/last-online";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  chat: ChatWithMember;
}

export const ChatHeader = ({ chat, className }: Props) => {
  const { setOpen } = useSeacrch();
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
                  <LastOnline last={new Date(chat.lastOnline ?? new Date())} />
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-none flex-shrink-0 items-center gap-2">
          {/* //!!todo */}
          <SearchInput chatId={chat.id} />
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-primary/10 hover:text-primary md:hidden"
            onClick={() => setOpen(chat.id, true)}
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

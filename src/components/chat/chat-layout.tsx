"use client";

import { useWebSocket } from "@/provider/socket-provider";
import React from "react";
import { ChatFooter } from "./chat-footer";
import { ChatMessageList } from "./chat-message-list";
import { ChatHeader } from "./chat-header";
import { ChatWithMember } from "@/types";
import { MemberLayout } from "../member/member-layout";
import { ChatListLoader } from "./chat-list-loader";

interface Props {
  chat: ChatWithMember;
}

export const ChatLayout = ({ chat }: Props) => {
  const { socket } = useWebSocket();

  React.useEffect(() => {
    if (socket) {
      socket.send("group", chat.id);
    }
  }, [chat.id, socket]);

  return (
    <div className="flex h-dvh flex-col">
      <ChatHeader chat={chat} />
      <div className="relative flex size-full">
        <div className="flex h-[calc(100dvh-70px)] w-full flex-1 flex-col">
          <ChatMessageList>
            <ChatListLoader count={40} />
          </ChatMessageList>
          <ChatFooter />
        </div>
        <MemberLayout members={chat.members} />
      </div>
    </div>
  );
};

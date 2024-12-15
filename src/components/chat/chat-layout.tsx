import React from "react";
import { ChatHeader } from "./chat-header";
import { ChatWithMember } from "@/types";
import { MemberLayout } from "../member/member-layout";
import { ChatBody } from "./chat-body";

interface Props {
  chat: ChatWithMember;
}

export const ChatLayout = ({ chat }: Props) => {
  return (
    <div className="flex h-dvh flex-col">
      <ChatHeader chat={chat} />
      <div className="relative flex size-full">
        <ChatBody id={chat.id} />
        <MemberLayout members={chat.member} />
      </div>
    </div>
  );
};

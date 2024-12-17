"use client";
import { Messages } from "@/types";
import React from "react";
import { ChatBubbleAction } from "../chat/chat-bubble";
import { Reply } from "lucide-react";
import useMessage from "@/hooks/use-message";

export function ReplyMessage({ message }: { message: Messages }) {
  const { setMessage } = useMessage();
  const handleClick = () => {
    setMessage(message);
  };
  return (
    <ChatBubbleAction
      className="size-7"
      title="Reply"
      icon={<Reply className="size-4" />}
      onClick={handleClick}
    />
  );
}

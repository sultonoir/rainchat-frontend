import React from "react";
import { ChatInput } from "./chat-input";

export const ChatFooter = () => {
  return (
    <div className="w-full flex-none flex-shrink-0 border-t p-3">
      <ChatInput />
    </div>
  );
};

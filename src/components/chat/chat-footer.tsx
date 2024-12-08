import React from "react";
import { ChatInput } from "./chat-input";

interface Props {
  id: string;
  close : () => void
}

export const ChatFooter = ({id,close}:Props) => {
  return (
    <div className="w-full flex-none flex-shrink-0 border-t p-3">
      <ChatInput id={id} close={close} />
    </div>
  );
};

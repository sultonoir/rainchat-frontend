import { MessageSquare } from "lucide-react";
import React from "react";

export function ChatListEmpty() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <MessageSquare />
      <p>U dont have chat</p>
    </div>
  );
}

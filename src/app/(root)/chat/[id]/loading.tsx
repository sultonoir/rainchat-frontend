import { ChatListLoader } from "@/components/chat/chat-list-loader";
import React from "react";

const Loading = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 gap-2 overflow-hidden p-4">
      <ChatListLoader count={40} />
    </div>
  );
};

export default Loading;

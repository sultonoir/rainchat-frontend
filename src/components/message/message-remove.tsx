import { Trash2 } from "lucide-react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { Chatlist, Messages, MessagesPage } from "@/types";
import { ChatBubbleAction } from "../chat/chat-bubble";
import { useWebSocket } from "@/provider/socket-provider";
import React from "react";
import { useSession } from "@/provider/session-provider";

interface DataRemove {
  chatId: string;
  messageId: string;
}

export function RemoveMessage({ message }: { message: Messages }) {
  const { socket } = useWebSocket();
  const { user } = useSession();
  const ctx = useQueryClient();

  const updateMessage = React.useCallback(
    (data: DataRemove) => {
      ctx.setQueryData<Chatlist[]>(["chatlist"], (oldData) => {
        if (!oldData) return [];
        return oldData.map((item) =>
          item.id === data.chatId
            ? {
                ...item,
                lastMessage: `${user?.name} : remove message`,
                lastSent: new Date(),
              }
            : item,
        );
      });
      ctx.setQueryData<InfiniteData<MessagesPage>>(
        ["message-list", message.chatId],
        (oldData) => {
          if (!oldData) return { pages: [], pageParams: [] };

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              return {
                ...page,
                messages: page.messages.filter((m) => m.id !== data.messageId),
              };
            }),
          };
        },
      );
    },
    [ctx, message.chatId, user?.name],
  );

  React.useEffect(() => {
    if (!socket) return;

    const handleSendMessage = (data: DataRemove) => {
      updateMessage(data);
    };

    socket.on("remove-message", handleSendMessage);

    return () => {
      socket.off("remove-message", handleSendMessage);
    };
  }, [message, socket, updateMessage]);

  const handleRemove = React.useCallback(() => {
    if (socket && user) {
      const data = {
        chatId: message.chatId,
        messageId: message.id,
        userId: user.id,
      };
      socket.emit("remove-message", data);
    }
  }, [message.chatId, message.id, socket, user]);

  return (
    <ChatBubbleAction
      className="size-7"
      title="Delete"
      icon={<Trash2 className="size-4" />}
      onClick={handleRemove}
    />
  );
}

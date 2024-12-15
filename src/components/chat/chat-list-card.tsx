import { Chatlist, Messages, MessagesPage } from "@/types";
import React from "react";
import { useWebSocket } from "@/provider/socket-provider";
import { UserAvatar } from "../user/user-avatar";
import { fromNow } from "@/lib/from-now";
import Link from "next/link";
import { useSidebar } from "@/hooks/use-sidebar";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { CustomImage } from "../ui/custom-image";

interface Props {
  chat: Chatlist;
}

export const ChatListCard = ({ chat }: Props) => {
  const { onlineUsers, socket } = useWebSocket();
  const online = onlineUsers.includes(chat.userId ?? "");
  const isMobile = useIsMobile();
  const { toggle } = useSidebar();
  const ctx = useQueryClient();

  const upadeMessage = React.useCallback(
    (data: Messages) => {
      ctx.setQueryData<Chatlist[]>(["chatlist"], (oldData) => {
        if (!oldData) {
          return [];
        }

        const exist = oldData.some((o) => o.id === data.chatId);

        return exist
          ? oldData.map((item) =>
              item.id === data.chatId
                ? {
                    ...item,
                    lastMessage: data.content ?? "",
                    lastSent: data.createdAt,
                  }
                : item,
            )
          : [...oldData];
      });
      ctx.setQueryData<InfiniteData<MessagesPage, string | null>>(
        ["message-list", chat.id],
        (oldData) => {
          if (!oldData) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          return {
            ...oldData,
            pages: oldData.pages.flatMap((page, index) => {
              // Modify only the first page or append to a specific one
              if (index === oldData.pages.length - 1) {
                return {
                  ...page,
                  messages: [...page.messages, data],
                };
              }
              return page;
            }),
          };
        },
      );
    },
    [chat.id, ctx],
  );

  React.useEffect(() => {
    if (socket) {
      socket.emit("join group", chat.id);

      const handleSendMessage = (data: Messages) => {
        console.log(data);
        upadeMessage(data);
      };

      socket.on("sendMessage", handleSendMessage);

      return () => {
        socket.off("sendMessage", handleSendMessage);
      };
    }
  }, [chat.id, socket, upadeMessage]);

  const handleClikced = () => {
    if (isMobile) {
      toggle();
    }
  };

  return (
    <div className="flex py-2 first:pt-0 last:pb-0">
      <Link
        onClick={handleClikced}
        href={`/chat/${chat.id}`}
        className="flex w-full gap-2 rounded-lg p-2 hover:bg-accent/50"
      >
        {chat.isGroup ? (
          <CustomImage src={chat.image} name={chat.name} />
        ) : (
          <UserAvatar online={online} src={chat.image} />
        )}
        <div className="flex flex-1 flex-col">
          <div className="flex w-full items-center justify-between">
            <h3 className="line-clamp-1">{chat.name}</h3>
            <p className="text-xs text-muted-foreground">
              {fromNow(new Date(chat.lastSent))}
            </p>
          </div>
          <div className="flex w-full items-center justify-between">
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {chat.lastMessage}
            </p>
            {chat.unreadCount > 0 && (
              <p className="rounded-lg bg-primary/10 px-2 py-1 text-xs text-primary">
                {chat.unreadCount < 99 ? chat.unreadCount : "99+"}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

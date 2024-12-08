"use client";

import { useWebSocket } from "@/provider/socket-provider";
import React from "react";
import { ChatHeader } from "./chat-header";
import { Chatlist, ChatWithMember, Messages, MessagesPage } from "@/types";
import { MemberLayout } from "../member/member-layout";
import { ChatBody } from "./chat-body";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";

interface Props {
  chat: ChatWithMember;
}

export const ChatLayout = ({ chat }: Props) => {
  const { socket } = useWebSocket();
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
      socket.on("sendMessage", (data: Messages) => {
        console.log(data);
        upadeMessage(data);
      });
    }
  }, [chat.id, socket, upadeMessage]);

  return (
    <div className="flex h-dvh flex-col">
      <ChatHeader chat={chat} />
      <div className="relative flex size-full">
        <ChatBody id={chat.id} />
        <MemberLayout members={chat.members} />
      </div>
    </div>
  );
};

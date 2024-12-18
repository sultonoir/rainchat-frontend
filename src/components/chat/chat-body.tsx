"use client";

import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ky from "ky";
import { MessagesPage } from "@/types";
import { ChatMessageList } from "./chat-message-list";
import { ChatFooter } from "./chat-footer";
import { ChatListLoader } from "./chat-list-loader";
import { ChatListEmpty } from "./chat-list-empty";
import { MessageContent } from "../message/message-content";

interface Props {
  id: string;
}

const useChatMessages = (chatId: string) => {
  const { data, fetchNextPage, status, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["message-list", chatId],
      queryFn: ({ pageParam }) =>
        ky
          .get(`/v1/chat/${chatId}/message`, {
            searchParams: pageParam ? { cursor: pageParam } : undefined,
          })
          .json<MessagesPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const messages = useMemo(
    () =>
      data?.pages
        .flatMap((page) => page.messages)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ) ?? [],
    [data],
  );

  return { messages, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};

export const ChatBody = ({ id }: Props) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { messages, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatMessages(id);

  // Helper: Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, []);

  // Maintain scroll position on data update
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isFetchingNextPage) return;

    const { scrollHeight, scrollTop } = container;
    if (messages.length === 0) {
      scrollToBottom();
    }
    if (messages.length > 1 && !isFetchingNextPage) {
      container.scrollTop =
        container.scrollHeight - scrollHeight + scrollTop + 800;
    }
  }, [messages, isFetchingNextPage, scrollToBottom]);

  // Fetch more data when scrolled to the top
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop <= 100 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex h-[calc(100dvh-70px)] w-full flex-1 flex-col">
      {(() => {
        switch (status) {
          case "pending":
            return (
              <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
                <ChatListLoader count={40} />
              </div>
            );

          case "error":
            return (
              <div className="flex flex-1 flex-col items-center justify-center">
                <ChatListEmpty />
              </div>
            );

          case "success":
            if (messages.length === 0) {
              return (
                <div className="flex flex-1 flex-col items-center justify-center">
                  <ChatListEmpty />
                </div>
              );
            }

            return (
              <ChatMessageList ref={scrollContainerRef}>
                <ChatLoader
                  isFetchingNextPage={isFetchingNextPage}
                  hasNextPage={hasNextPage}
                />
                {messages.map((item, index) => (
                  <MessageContent key={index} message={item} />
                ))}
              </ChatMessageList>
            );

          default:
            return null; // Optional: Fallback jika `status` tidak diketahui
        }
      })()}
      <ChatFooter id={id} close={scrollToBottom} />
    </div>
  );
};

const ChatLoader = ({
  isFetchingNextPage,
}: {
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
}) => {
  if (isFetchingNextPage) {
    return (
      <div className="flex justify-center py-2">
        <p className="text-muted-foreground">Loading more messages...</p>
      </div>
    );
  }
  return null;
};

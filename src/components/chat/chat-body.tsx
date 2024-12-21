"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { ChatMessageList } from "./chat-message-list";
import { ChatFooter } from "./chat-footer";
import { ChatListLoader } from "./chat-list-loader";
import { ChatListEmpty } from "./chat-list-empty";
import { MessageContent } from "../message/message-content";
import { useChatMessages } from "@/hooks/use-chat-message";

interface Props {
  id: string;
}

export const ChatBody = ({ id }: Props) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    pageParam,
  } = useChatMessages(id);


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

    if (!pageParam) {
      const timeout = setTimeout(() => {
        scrollToBottom();
      }, 100); // Set timeout selama 500ms (atau sesuaikan sesuai kebutuhan)
      return () => clearTimeout(timeout); // Membersihkan timeout jika dependency berubah
    }

    if (messages.length > 1 && !isFetchingNextPage) {
      container.scrollTop =
        container.scrollHeight - scrollHeight + scrollTop + 500;
    }
  }, [messages, pageParam, isFetchingNextPage, scrollToBottom]);

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

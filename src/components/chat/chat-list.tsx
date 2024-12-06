"use client";

import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import React from "react";
import { ChatListLoader } from "./chat-list-loader";
import { ChatListEmpty } from "./chat-list-empty";
import { Chatlist } from "@/types";
import { ChatListCard } from "./chat-list-card";
import { getGlobalError } from "@/lib/getGlobalError";

export const ChatList = () => {
  const { data, status } = useQuery({
    queryKey: ["chatlist"],
    queryFn: async () => {
      try {
        const data = await ky.get("/v1/chat").json<Chatlist[]>();
        return data;
      } catch (error) {
        const message = await getGlobalError(error);
        throw new Error(message);
      }
    },
  });

  switch (status) {
    case "pending":
      return (
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden p-4 pt-0">
          <ChatListLoader count={40} />
        </div>
      );
    case "error":
      return (
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
          <ChatListEmpty />
        </div>
      );
    case "success":
      return (
        <>
          {data && data?.length <= 0 ? (
            <ChatListEmpty />
          ) : (
            <div className="flex flex-1 flex-col divide-y overflow-y-auto p-4 pt-0">
              {data?.map((item) => <ChatListCard chat={item} key={item.id} />)}
            </div>
          )}
        </>
      );
  }
};

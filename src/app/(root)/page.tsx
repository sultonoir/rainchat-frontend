import { ChatListEmpty } from "@/components/chat/chat-list-empty";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Home",
};

const Page = () => {
  return <ChatListEmpty />;
};

export default Page;

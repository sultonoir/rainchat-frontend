import { ChatListEmpty } from "@/components/chat/chat-list-empty";
import { SearchInput } from "@/components/ui/search-input";
import { Metadata } from "next";
import React from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
};

const Page = () => {
  return (
    <div className="grid min-h-screen place-items-center">
      <ChatListEmpty />
      <SearchInput />
    </div>
  );
};

export default Page;

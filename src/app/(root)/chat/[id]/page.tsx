import { ChatLayout } from "@/components/chat/chat-layout";
import { SearchMobile } from "@/components/search/search-mobile";
import { getChatById } from "@/server/routes/chat/chat.service";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const chat = await getChatById(id);
  return {
    title: chat?.name ?? "chat",
  };
}

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const chat = await getChatById(id);

  if (!chat) {
    return notFound();
  }

  return (
    <>
      <ChatLayout chat={chat} />
      <SearchMobile chatId={id} />
    </>
  );
};

export default Page;

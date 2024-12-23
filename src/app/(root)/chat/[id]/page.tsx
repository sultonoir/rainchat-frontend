import { ChatLayout } from "@/components/chat/chat-layout";
import { SearchMobile } from "@/components/search/search-mobile";
import { getChatById } from "@/server/routes/chat/chat.service";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
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
  const queryClient = new QueryClient();
  const { id } = await params;

  const chat = await queryClient.fetchQuery({
    queryKey: [id],
    queryFn: async () => await getChatById(id),
  });

  if (!chat) {
    return notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatLayout chat={chat} />
      <SearchMobile chatId={id} />
    </HydrationBoundary>
  );
};

export default Page;

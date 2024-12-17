import { UserJoinChat } from "@/components/user/user-join-chat";
import { getInviteCode } from "@/server/routes/chat/chat.service";
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
  const chat = await getInviteCode(id);
  return {
    title: chat?.name ?? "invite",
  };
}

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const chat = await getInviteCode(id);

  if (!chat) {
    return notFound();
  }

  return (
    <div className="grid min-h-screen place-items-center">
      <UserJoinChat chat={chat} />
    </div>
  );
};

export default Page;

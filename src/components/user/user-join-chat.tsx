"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChatWithMember } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/provider/session-provider";
import { useRouter } from "next/navigation";
import ky from "ky";
import { getGlobalError } from "@/lib/getGlobalError";
import { toast } from "sonner";
import Image from "next/image";

export function UserJoinChat({ chat }: { chat: ChatWithMember }) {
  const { user } = useSession();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationKey: ["join-chat"],
    mutationFn: async () => {
      try {
        return await ky
          .post("/v1/member/add", {
            json: {
              chatId: chat.id,
            },
          })
          .json<{ chatId: string }>();
      } catch (error) {
        const message = await getGlobalError(error);
        throw new Error(message);
      }
    },
    onSuccess(data) {
      router.push(`/chat/${data.chatId}`);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (!user) {
      return router.push(`/signin?code=${chat.invitedCode}`);
    }
    mutate();
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center">
        <CardTitle>{chat.name}</CardTitle>
        <CardDescription>{chat.desc}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-8">
        <Image
          src={chat.image}
          alt={chat.name}
          width={200}
          height={200}
          priority
          className="aspect-square rounded-full object-cover ring-2 ring-white"
        />
        <div className="text-muted-foreground">
          {chat.member.length} Members
        </div>
        <Button onClick={handleSubmit} disabled={isPending} loading={isPending}>
          Join chat
        </Button>
      </CardContent>
    </Card>
  );
}

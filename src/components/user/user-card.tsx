import { UserAvatar } from "./user-avatar";
import Image from "next/image";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import React from "react";
import { useSession } from "@/provider/session-provider";
import { Button } from "../ui/button";
import { useWebSocket } from "@/provider/socket-provider";
import { cn } from "@/lib/utils";
import { FormEditUser } from "../form/user/form-edit-user";
import { FormSendDm } from "../form/send-dm/form-send-dm";
import { LinkifyUrl } from "../ui/linkify";

interface UserCardProps extends React.HtmlHTMLAttributes<HTMLElement> {
  userId: string;
  name?: string | null;
}

export default function UserCard({ userId, className, name }: UserCardProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      try {
        return await ky.get(`/v1/user/${userId}`).json<User>();
      } catch (error) {
        console.log(error);
      }
    },
  });
  const { onlineUsers } = useWebSocket();
  const online = onlineUsers.includes(userId);
  const { user } = useSession();
  const isMe = userId === user?.id;

  if (isLoading) {
    return (
      <Button
        size="icon"
        variant="outline"
        className="rounded-full"
        loading={isLoading}
        disabled={isLoading}
      />
    );
  }
  return (
    <div
      className={cn(
        "relative w-full min-w-72 overflow-hidden border-zinc-200/80 backdrop-blur-xl dark:border-zinc-800/80 md:max-w-lg md:rounded-2xl md:border md:bg-white/90 md:dark:bg-zinc-900/90",
        className,
      )}
    >
      <div className="relative h-28 w-full">
        <Image
          alt={data?.name ?? "image profile"}
          src={data?.baner && data.baner !== "" ? data.baner : "/banner.webp"}
          fill
          sizes="300px"
          className="size-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 border-t p-4">
        <div className="flex items-start gap-6">
          <UserAvatar src={data?.image} className="size-14" online={online} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {data?.name ?? data?.username}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {data?.username}
                </p>
              </div>
              {isMe && <FormEditUser />}
            </div>
            <LinkifyUrl
              className="text-xs text-muted-foreground"
              message={data?.status ?? ""}
            />
          </div>
        </div>
        {!isMe && <FormSendDm userId={userId} name={name ?? ""} />}
      </div>
    </div>
  );
}

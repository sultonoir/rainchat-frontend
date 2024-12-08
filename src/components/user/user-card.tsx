import { UserAvatar } from "./user-avatar";
import Image from "next/image";
import { Input } from "../ui/input";
import { Chatlist, User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import React, { FormEvent, useState } from "react";
import { useSession } from "@/provider/session-provider";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { getGlobalError } from "@/lib/getGlobalError";
import { useWebSocket } from "@/provider/socket-provider";
import { cn } from "@/lib/utils";
import { FormEditUser } from "../form/user/form-edit-user";

interface UserCardProps extends React.HtmlHTMLAttributes<HTMLElement> {
  userId: string;
}

export default function UserCard({ userId, className }: UserCardProps) {
  const { data } = useQuery({
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
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border-zinc-200/80 backdrop-blur-xl dark:border-zinc-800/80 md:max-w-lg md:rounded-2xl md:border md:bg-white/90 md:dark:bg-zinc-900/90",
        className,
      )}
    >
      <div className="relative h-28 w-full">
        <Image
          alt={data?.name ?? "image profile"}
          src={data?.baner && data.baner !== "" ? data.baner : "/banner.webp"}
          fill
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
          </div>
        </div>
        <p className="text-wrap text-sm text-zinc-500">{data?.status}</p>
        {!isMe && <FormSendDm userId={userId} />}
      </div>
    </div>
  );
}

function FormSendDm({ userId }: UserCardProps) {
  const { user } = useSession();
  const [message, setMessage] = useState("");
  const ctx = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["send-dm"],
    mutationFn: async () => {
      const data = {
        other: userId,
        userId: user?.id ?? "",
        content: message.trim(),
      };
      return await ky
        .post("/v1/chat/dm", {
          json: data,
        })
        .json<Chatlist>();
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(data) {
      ctx.setQueryData<Chatlist[]>(["chatlist"], (oldData) => {
        if (!oldData) {
          return [data];
        }

        const exist = oldData.some((o) => o.id === data?.id);

        return exist
          ? oldData.map((item) =>
              item.id === data?.id ? { ...item, ...data } : item,
            )
          : [data, ...oldData];
      });
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await mutateAsync();
    } catch (error) {
      const message = await getGlobalError(error);
      toast.error(message);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <Input
        disabled={isPending}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button type="submit" className="hidden">
        Clickme
      </Button>
    </form>
  );
}

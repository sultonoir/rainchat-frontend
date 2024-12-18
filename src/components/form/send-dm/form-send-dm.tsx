import * as React from "react";
import { useSession } from "@/provider/session-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import { Chatlist } from "@/types";
import { toast } from "sonner";
import { getGlobalError } from "@/lib/getGlobalError";
import { Button } from "@/components/ui/button";
import { useMemberDialog } from "@/hooks/user-member-dialog";
import { EmojiPicker } from "@/components/ui/emoji-picker";

interface Props {
  userId: string;
  name: string;
}

export function FormSendDm({ userId, name }: Props) {
  const { setOpen } = useMemberDialog();
  const { user } = useSession();
  const [message, setMessage] = React.useState("");
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
        .post("/v1/dm", {
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
      setOpen(userId, false);
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await mutateAsync();
    } catch (error) {
      const message = await getGlobalError(error);
      toast.error(message);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-1 items-center gap-2 rounded-lg border transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
    >
      <input
        disabled={isPending}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Send message to @${name}`}
        className="bg-transparent p-2 outline-none placeholder:text-sm"
      />
      <div className="flex-none">
        <EmojiPicker
          onChange={(value) => {
            setMessage(message + value);
          }}
        />
      </div>
      <Button type="submit" className="hidden">
        Clickme
      </Button>
    </form>
  );
}

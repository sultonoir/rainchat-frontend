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
import { useWebSocket } from "@/provider/socket-provider";

interface Props {
  userId: string;
  name: string;
}

export function FormSendDm({ userId, name }: Props) {
  const { socket } = useWebSocket();
  const { setOpen } = useMemberDialog();
  const { user } = useSession();
  const [message, setMessage] = React.useState("");
  const ctx = useQueryClient();

  const updateMessage = React.useCallback(
    (data: Chatlist) => {
      if (data.userId !== user?.id) {
        try {
          const audio = new Audio("/ring.mp3");
          audio.play();
        } catch (error) {
          console.log(error);
        }
      }
      ctx.setQueryData<Chatlist[]>(["chatlist"], (oldData) => {
        if (!oldData) return [];

        const exist = oldData.some((o) => o.id === data.id);
        return exist
          ? oldData.map((item) =>
              item.id === data.id
                ? {
                    ...item,
                    lastMessage: data.lastMessage,
                    lastSent: data.lastSent,
                  }
                : item,
            )
          : [data, ...oldData];
      });
    },
    [ctx, user],
  );

  React.useEffect(() => {
    if (!socket) return;

    const handleSendMessage = (data: Chatlist) => {
      console.log(data);
      updateMessage(data); // Fungsi untuk memperbarui data React Query
    };

    // Tambahkan listener untuk event "sendMessage"
    socket.on("sendDm", handleSendMessage);

    // Cleanup: hapus listener dan reset grup saat komponen unmount
    return () => {
      socket.off("sendDm", handleSendMessage);
    };
  }, [socket, updateMessage]);

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
    onSuccess() {
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

import * as React from "react";
import { useSession } from "@/provider/session-provider";
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
  const [isPending, setIsPending] = React.useState(false);
  const { user } = useSession();
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    try {
      if (socket && user) {
        const data = {
          other: userId,
          userId: user?.id ?? "",
          content: message.trim(),
        };
        socket.emit("sendDm", data);
      }
    } catch (error) {
      const message = await getGlobalError(error);
      toast.error(message);
    } finally {
      setIsPending(false);
      setMessage("");
      setOpen(userId, false);
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
        className="w-full bg-transparent p-2 outline-none placeholder:text-sm"
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

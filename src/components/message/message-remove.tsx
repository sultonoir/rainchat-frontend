import { getGlobalError } from "@/lib/getGlobalError";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import ky from "ky";
import { Messages, MessagesPage } from "@/types";
import { ChatBubbleAction } from "../chat/chat-bubble";

export function RemoveMessage({ message }: { message: Messages }) {
  const ctx = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["remove-message"],
    mutationFn: async () => {
      try {
        return ky
          .delete("/v1/chat/message", {
            json: {
              chatId: message.chatId,
              messageId: message.id,
            },
          })
          .json<string>();
      } catch (error) {
        const message = await getGlobalError(error);
        throw new Error(message);
      }
    },
    onSuccess(data) {
      ctx.setQueryData<InfiniteData<MessagesPage>>(
        ["message-list", message.chatId],
        (oldData) => {
          if (!oldData) return { pages: [], pageParams: [] };

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              return {
                ...page,
                messages: page.messages.filter((m) => m.id !== data),
              };
            }),
          };
        },
      );
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  return (
    <ChatBubbleAction
      className="size-7"
      title="Delete"
      disabled={isPending}
      loading={isPending}
      icon={<Trash2 className="size-4" />}
      onClick={() => mutate()}
    />
  );
}

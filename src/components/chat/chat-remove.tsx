import { getGlobalError } from "@/lib/getGlobalError";
import { Chatlist } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import { ContextMenuItem } from "../ui/context-menu";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function RemoveChatlist({ chatId }: { chatId: string }) {
  const ctx = useQueryClient();
  const router = useRouter();
  const { mutate } = useMutation({
    mutationKey: ["remove-chatlist"],
    mutationFn: async () => {
      try {
        return await ky.delete(`/v1/dm/${chatId}`).json<{ chatId: string }>();
      } catch (error) {
        const message = await getGlobalError(error);
        throw new Error(message);
      }
    },
    onSuccess(data) {
      ctx.setQueryData<Chatlist[]>(["chatlist"], (oldData) => {
        if (!oldData) return [];

        return oldData.filter((d) => d.id !== data.chatId);
      });
      router.replace("/");
    },
  });

  return (
    <ContextMenuItem className="gap-2" onSelect={() => mutate()}>
      <Trash2 size={20} className="text-muted-foreground" />
      Remove chatlist
    </ContextMenuItem>
  );
}

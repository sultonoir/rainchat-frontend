import { getGlobalError } from "@/lib/getGlobalError";
import { Chatlist } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import { LogOut } from "lucide-react";
import { ContextMenuItem } from "../ui/context-menu";

export function OutGroup({ chatId }: { chatId: string }) {
  const ctx = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["remove-chatlist"],
    mutationFn: async () => {
      try {
        return await ky
          .post(`/v1/group/out`, {
            json: { chatId },
          })
          .json<{ chatId: string }>();
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
    },
  });

  return (
    <ContextMenuItem className="gap-2" onSelect={() => mutate()}>
      <LogOut size={20} className="text-muted-foreground" />
      Out Group
    </ContextMenuItem>
  );
}
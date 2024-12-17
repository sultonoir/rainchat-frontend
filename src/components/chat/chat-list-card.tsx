import { Chatlist, Messages, MessagesPage } from "@/types";
import React from "react";
import { useWebSocket } from "@/provider/socket-provider";
import { UserAvatar } from "../user/user-avatar";
import { fromNow } from "@/lib/from-now";
import Link from "next/link";
import { useSidebar } from "@/hooks/use-sidebar";
import { useIsMobile } from "@/hooks/use-is-mobile";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CustomImage } from "../ui/custom-image";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { LogOut, Table2Icon, Trash2 } from "lucide-react";
import ky from "ky";
import { getGlobalError } from "@/lib/getGlobalError";

interface Props {
  chat: Chatlist;
}

export const ChatListCard = ({ chat }: Props) => {
  const { onlineUsers, socket } = useWebSocket();
  const online = onlineUsers.includes(chat.userId ?? "");
  const isMobile = useIsMobile();
  const { toggle } = useSidebar();
  const ctx = useQueryClient();

  const updateMessage = React.useCallback(
    (data: Messages) => {
      ctx.setQueryData<Chatlist[]>(["chatlist"], (oldData) => {
        if (!oldData) return [];

        return oldData.map((item) =>
          item.id === data.chatId
            ? {
                ...item,
                lastMessage: data.content ?? "",
                lastSent: data.createdAt,
              }
            : item,
        );
      });

      ctx.setQueryData<InfiniteData<MessagesPage>>(
        ["message-list", chat.id],
        (oldData) => {
          if (!oldData) return { pages: [], pageParams: [] };

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) =>
              index === oldData.pages.length - 1
                ? { ...page, messages: [...page.messages, data] }
                : page,
            ),
          };
        },
      );
    },
    [chat.id, ctx],
  );
  const hasJoinedGroup = React.useRef(new Set<string>());

  React.useEffect(() => {
    if (!socket) return;

    // Gunakan ref untuk melacak grup yang sudah di-join

    if (!hasJoinedGroup.current.has(chat.id)) {
      socket.emit("join group", chat.id); // Emit hanya sekali untuk tiap chat.id
      hasJoinedGroup.current.add(chat.id);
    }

    const handleSendMessage = (data: Messages) => {
      updateMessage(data); // Fungsi untuk memperbarui data React Query
    };

    // Tambahkan listener untuk event "sendMessage"
    socket.on("sendMessage", handleSendMessage);

    // Cleanup: hapus listener dan reset grup saat komponen unmount
    return () => {
      socket.off("sendMessage", handleSendMessage);
    };
  }, [chat.id, socket, updateMessage]);

  const handleClicked = () => {
    if (isMobile) {
      toggle();
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex py-2 first:pt-0 last:pb-0">
          <Link
            onClick={handleClicked}
            href={`/chat/${chat.id}`}
            className="flex w-full gap-2 rounded-lg p-2 hover:bg-accent/50"
          >
            {chat.isGroup ? (
              <CustomImage src={chat.image} name={chat.name} />
            ) : (
              <UserAvatar online={online} src={chat.image} />
            )}
            <div className="flex flex-1 flex-col">
              <div className="flex w-full items-center justify-between">
                <h3 className="line-clamp-1">{chat.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {fromNow(new Date(chat.lastSent))}
                </p>
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="line-clamp-1 text-sm text-muted-foreground">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem className="gap-2" asChild>
          <Link
            onClick={handleClicked}
            href={`/chat/${chat.id}`}
            target="_blank"
          >
            <Table2Icon size={20} className="text-muted-foreground" />
            Open link in the new tab
          </Link>
        </ContextMenuItem>
        <ContextMenuSeparator />
        {chat.isGroup ? (
          <OutGroup chatId={chat.id} />
        ) : (
          <RemoveChatlist chatId={chat.id} />
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

function RemoveChatlist({ chatId }: { chatId: string }) {
  const ctx = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["remove-chatlist"],
    mutationFn: async () => {
      try {
        return await ky.delete(`/v1/chat/chatlist/${chatId}`).json<string>();
      } catch (error) {
        const message = await getGlobalError(error);
        throw new Error(message);
      }
    },
    onSuccess(data) {
      ctx.setQueryData<Chatlist[]>(["chatlist"], (oldData) => {
        if (!oldData) return [];

        return oldData.filter((d) => d.id !== data);
      });
    },
  });

  return (
    <ContextMenuItem className="gap-2" onSelect={() => mutate()}>
      <Trash2 size={20} className="text-muted-foreground" />
      Remove chatlist
    </ContextMenuItem>
  );
}

function OutGroup({ chatId }: { chatId: string }) {
  const ctx = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["remove-chatlist"],
    mutationFn: async () => {
      try {
        return await ky
          .post(`/v1/chat/out`, {
            json: { chatId },
          })
          .json<string>();
      } catch (error) {
        const message = await getGlobalError(error);
        throw new Error(message);
      }
    },
    onSuccess(data) {
      ctx.setQueryData<Chatlist[]>(["chatlist"], (oldData) => {
        if (!oldData) return [];

        return oldData.filter((d) => d.id !== data);
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

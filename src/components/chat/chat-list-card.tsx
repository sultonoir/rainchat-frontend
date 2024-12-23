import { Chatlist } from "@/types";
import React from "react";
import { useWebSocket } from "@/provider/socket-provider";
import { UserAvatar } from "../user/user-avatar";
import { fromNow } from "@/lib/from-now";
import Link from "next/link";
import { useSidebar } from "@/hooks/use-sidebar";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { CustomImage } from "../ui/custom-image";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Table2Icon } from "lucide-react";
import { OutGroup } from "./chat-out-group";
import { RemoveChatlist } from "./chat-remove";

interface Props {
  chat: Chatlist;
}

export const ChatListCard = ({ chat }: Props) => {
  const { onlineUsers, socket } = useWebSocket();
  const online = onlineUsers.includes(chat.userId ?? "");
  const isMobile = useIsMobile();
  const { toggle } = useSidebar();
  const hasJoinedGroup = React.useRef(new Set<string>());

  React.useEffect(() => {
    if (!socket) return;

    // Gunakan ref untuk melacak grup yang sudah di-join

    if (!hasJoinedGroup.current.has(chat.id)) {
      socket.emit("join group", chat.id); // Emit hanya sekali untuk tiap chat.id
      hasJoinedGroup.current.add(chat.id);
    }
  }, [chat.id, socket]);

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
            rel="noopener noreferrer"
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

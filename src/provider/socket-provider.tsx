"use client";
import { Chatlist, Messages, MessagesPage, Session } from "@/types";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import io, { Socket } from "socket.io-client";

// URL server WebSocket
const socketURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : process.env.NEXT_PUBLIC_WS_URL;
// Pastikan URL ini sesuai dengan server yang Anda jalankan

// Tipe untuk WebSocket Context
interface WebSocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
  connected: boolean;
}

// Membuat WebSocketContext dengan tipe WebSocketContextType
const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

// Custom hook untuk menggunakan WebSocketContext
export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

// WebSocketProvider untuk menyediakan socket dan status koneksi
interface WebSocketProviderProps {
  children: ReactNode;
  user: Session | null;
}

interface SendDm {
  message: Messages;
  chatlist: {
    senderId: string;
    chatId: string;
    member:
      | {
          id: string;
          name: string;
          image: string;
        }[]
      | undefined;
  };
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  user,
}) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const ctx = useQueryClient();

  const updateMessage = React.useCallback(
    (data: SendDm) => {
      if (data.message.senderId !== user?.id) {
        // Gunakan Notification API
        if (Notification.permission === "granted") {
          const notification = new Notification("Pesan baru", {
            body: data.message.content ?? "Send message",
            icon: "/icon.png",
          });
          notification.onclick = () => {
            try {
              const audio = new Audio("/ring.mp3");
              audio.play();
            } catch (error) {
              console.log(error);
            }
          };
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission();
        }
      }

      const member = data.chatlist.member?.find((item) => item.id !== user?.id);

      console.log({ member });

      ctx.setQueryData<Chatlist[]>(["chatlist"], (oldData) => {
        if (!oldData) return [];

        // Periksa apakah chatlist sudah ada di dalam data
        const exist = oldData.some((o) => o.id === data.chatlist.chatId); // Gunakan chatId dari SendDm
        return exist
          ? oldData.map((item) =>
              item.id === data.chatlist.chatId
                ? {
                    ...item,
                    lastMessage: data.message.content ?? "",
                    lastSent: new Date(),
                  } // Update lastMessage dan lastSent
                : item,
            )
          : [
              {
                id: data.chatlist.chatId,
                name: member?.name ?? "",
                image: member?.image ?? "",
                lastMessage: data.message.content ?? "",
                unreadCount: 1, // Mengasumsikan chat baru
                lastSent: new Date(),
                isGroup: false,
                senderId: data.chatlist.senderId,
              },
              ...oldData,
            ];
      });

      ctx.setQueryData<InfiniteData<MessagesPage>>(
        ["message-list", data.message.chatId],
        (oldData) => {
          if (!oldData) return { pages: [], pageParams: [] };

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) =>
              index === oldData.pages.length - 1
                ? { ...page, messages: [...page.messages, data.message] }
                : page,
            ),
          };
        },
      );
    },
    [ctx, user],
  );

  useEffect(() => {
    if (!user) return;
    // Membuat koneksi socket hanya sekali
    const newSocket = io(socketURL, {
      query: {
        userId: user.id,
      },
    });

    setSocket(newSocket);

    // Event handler untuk status koneksi
    newSocket.on("connect", () => {
      setConnected(true);
    });

    newSocket.on("getOnlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });

    const handleSendMessage = (data: SendDm) => {
      if (data.chatlist.member?.some((item) => item.id === user.id)) {
        updateMessage(data);
      }
    };

    // Tambahkan listener untuk event "sendDm"
    newSocket.on("sendDm", handleSendMessage);

    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    // Mulai koneksi WebSocket secara manual
    newSocket.connect();

    // Cleanup saat komponen unmount
    return () => {
      newSocket.disconnect();
    };
  }, [updateMessage, user]); // Kosongkan array dependencies agar hanya dijalankan sekali saat mount

  return (
    <WebSocketContext.Provider value={{ socket, connected, onlineUsers }}>
      {children}
    </WebSocketContext.Provider>
  );
};

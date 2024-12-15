"use client";
import { Session } from "@/types";
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

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  user,
}) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

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

    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    // Mulai koneksi WebSocket secara manual
    newSocket.connect();

    // Cleanup saat komponen unmount
    return () => {
      newSocket.disconnect();
    };
  }, [user]); // Kosongkan array dependencies agar hanya dijalankan sekali saat mount

  return (
    <WebSocketContext.Provider value={{ socket, connected, onlineUsers }}>
      {children}
    </WebSocketContext.Provider>
  );
};

import * as React from "react";
import { ReactProvider } from "./react-provider";
import { Session } from "@/types";
import { SessionProvider } from "./session-provider";
import { Toaster } from "@/components/ui/sonner";
import { WebSocketProvider } from "./socket-provider";

interface Props {
  children: React.ReactNode;
  user: Session | null;
}

export default function Provider({ children, user }: Props) {
  return (
    <ReactProvider>
      <WebSocketProvider user={user}>
        <SessionProvider user={user}>{children}</SessionProvider>
      </WebSocketProvider>
      <Toaster richColors position="top-center" />
    </ReactProvider>
  );
}

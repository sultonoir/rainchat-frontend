import * as React from "react";
import { ReactProvider } from "./react-provider";
import { Session } from "@/types";
import { SessionProvider } from "./session-provider";
import { Toaster } from "@/components/ui/sonner";
import { WebSocketProvider } from "./socket-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./theme-provide";
import { MediaDialog } from "@/components/ui/media-dialog";

interface Props {
  children: React.ReactNode;
  user: Session | null;
}

export default function Provider({ children, user }: Props) {
  return (
    <ReactProvider>
      <SessionProvider user={user}>
        <WebSocketProvider user={user}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </WebSocketProvider>
      </SessionProvider>
      <MediaDialog />
      <Toaster richColors position="top-center" />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </ReactProvider>
  );
}

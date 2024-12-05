"use client";

import { Session } from "@/types";
import { createContext, useContext } from "react";

interface SessionProviderProps {
  user: Session | null;
}

const SessionContext = createContext<SessionProviderProps>(
  {} as SessionProviderProps,
);

export const SessionProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: Session | null;
}) => {
  return (
    <SessionContext.Provider value={{ user }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const sessionContext = useContext(SessionContext);

  if (!sessionContext) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return sessionContext;
};

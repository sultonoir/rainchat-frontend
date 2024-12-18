"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../ui/input";
import useShow from "@/hooks/use-show";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import { MemberCard } from "./member-card";
import { Member } from "@/types";
import { useWebSocket } from "@/provider/socket-provider";

interface Props {
  members: Member[];
  isGroup: boolean;
}

export const MemberLayout = ({ members, isGroup }: Props) => {
  const [value, setValue] = React.useState("");
  const { onlineUsers } = useWebSocket();
  const isMobile = useIsMobile();
  const { show } = useShow();

  // Mengelompokkan anggota berdasarkan status online/offline
  const onlineMember = React.useMemo(
    () => members.filter((item) => onlineUsers.includes(item.userId)),
    [members, onlineUsers],
  );

  const offlineMember = React.useMemo(
    () => members.filter((item) => !onlineUsers.includes(item.userId)),
    [members, onlineUsers],
  );

  // Filter anggota berdasarkan pencarian nama
  const filterMember = React.useMemo(() => {
    const trimmedValue = value.trim().toLowerCase();
    return members.filter((i) => i.name?.toLowerCase().includes(trimmedValue));
  }, [members, value]);

  // Variabel untuk animasi sidebar
  const sidebarVariants = {
    open: {
      width: isMobile ? "100%" : "300px",
      opacity: 1,
      display: "flex",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
      },
    },
    closed: {
      width: 0,
      opacity: 0,
      display: "none",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
      },
    },
  };

  const open = isGroup && show;
  return (
    <AnimatePresence>
      <motion.div
        key="sidebar"
        initial="closed"
        animate={open ? "open" : "closed"}
        exit="closed"
        variants={sidebarVariants}
        className={cn("border-border/50 lg:border-l", {
          "absolute right-0 z-10 bg-secondary lg:relative": isMobile,
        })}
      >
        <div className="flex w-full flex-col">
          <div className="flex flex-none p-2">
            <Input
              placeholder="search member..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="search"
            />
          </div>
          <div className="flex h-[calc(100dvh-90px)] flex-col gap-2 overflow-y-auto p-3 lg:h-full lg:flex-1">
            {value.trim() === "" ? (
              <>
                {/* Menampilkan anggota online */}
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground">Online</p>
                  {onlineMember.map((m) => (
                    <MemberCard key={m.id} isMobile={isMobile} member={m} />
                  ))}
                </div>

                {/* Menampilkan anggota offline */}
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground">Offline</p>
                  {offlineMember.map((m) => (
                    <MemberCard key={m.id} isMobile={isMobile} member={m} />
                  ))}
                </div>
              </>
            ) : (
              <>
                {filterMember.length > 0 && value !== "" && (
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground">Search Results</p>
                    {filterMember.map((m) => (
                      <MemberCard key={m.id} isMobile={isMobile} member={m} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

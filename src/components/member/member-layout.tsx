"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../ui/input";
import useShow from "@/hooks/use-show";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import { MemberCard } from "./member-card";
import { Member } from "@/types";

interface Props {
  members: Member[];
}

export const MemberLayout = ({ members }: Props) => {
  const isMobile = useIsMobile();
  const { show } = useShow();

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

  return (
    <AnimatePresence>
      <motion.div
        key="sidebar"
        initial="closed"
        animate={show ? "open" : "closed"}
        exit="closed"
        variants={sidebarVariants}
        className={cn("border-border/50 lg:border-l", {
          "absolute right-0 z-10 bg-secondary lg:relative": isMobile,
        })}
      >
        <div className="flex w-full flex-col">
          <div className="flex flex-none p-2 md:hidden">
            <Input />
          </div>
          <div className="flex h-[calc(100dvh-90px)] flex-col gap-2 overflow-y-auto p-3 lg:h-full lg:flex-1">
            {members?.map((m) => (
              <MemberCard key={m.id} isMobile={isMobile} member={m} />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

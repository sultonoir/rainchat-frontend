"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserProfile } from "./user-profile";
import { Button } from "../ui/button";
import { useSession } from "@/provider/session-provider";
import { useWebSocket } from "@/provider/socket-provider";
import UserCard from "./user-card";

export const UserDropdown = () => {
  const { user } = useSession();
  const { onlineUsers } = useWebSocket();

  const online = onlineUsers.includes(user?.id ?? "");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        <Button variant="ghost" className="size-fit p-2">
          <UserProfile
            username={user?.username}
            name={user?.name}
            src={user?.image}
            online={online}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px]">
        <UserCard userId={user?.id ?? ""} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import UserCard from "../user/user-card";
import { Member } from "@/types";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { UserAvatar } from "../user/user-avatar";
import { useWebSocket } from "@/provider/socket-provider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemberDialog } from "@/hooks/user-member-dialog";

interface Props {
  isMobile: boolean;
  member: Member;
}

export function MemberCard({ isMobile, member }: Props) {
  const { openStates, setOpen } = useMemberDialog();
  const isOpen = openStates[member.userId] ?? false; // Default state is false
  const { onlineUsers } = useWebSocket();

  const online = onlineUsers.includes(member.userId);

  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={(open) => setOpen(member.userId, open)}
      >
        <DrawerTrigger asChild>
          <Button variant="ghost" className="h-fit w-full justify-start p-2">
            <UserAvatar online={online} src={member.user.image} />
            <div className="flex flex-col">
              <h3>{member.name ?? member.user.username}</h3>
              <p className="text-xs text-muted-foreground">
                {member.user.status}
              </p>
            </div>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="sr-only text-left">
            <DrawerTitle>{member.name}</DrawerTitle>
            <DrawerDescription className="sr-only">
              {member.name}
            </DrawerDescription>
          </DrawerHeader>
          <UserCard className="pt-4" userId={member.userId} name={member.name} />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => setOpen(member.userId, open)}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-fit w-full justify-start p-2">
          <UserAvatar online={online} src={member.user.image} />
          <div className="flex flex-col">
            <h3>{member.name ?? member.user.username}</h3>
            <p className="text-xs text-muted-foreground">
              {member.user.status}
            </p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-fit rounded-2xl border-none p-0"
        side="right"
      >
        <UserCard userId={member.userId} name={member.name} />
      </PopoverContent>
    </Popover>
  );
}

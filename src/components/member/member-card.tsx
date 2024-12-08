import React from "react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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

interface Props {
  isMobile: boolean;
  member: Member;
}

export function MemberCard({ isMobile, member }: Props) {
  const [open, setOpen] = React.useState(false);
  const { onlineUsers } = useWebSocket();

  const online = onlineUsers.includes(member.userId);
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" className="h-fit w-full justify-start p-2">
            <UserAvatar online={online} />
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
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DrawerDescription>
          </DrawerHeader>
          <UserCard className="pt-4" userId={member.userId} />
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
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" className="h-fit w-full justify-start p-2">
          <UserAvatar online={online} />
          <div className="flex flex-col">
            <h3>{member.name ?? member.user.username}</h3>
            <p className="text-xs text-muted-foreground">
              {member.user.status}
            </p>
          </div>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        className="size-fit rounded-2xl border-none p-0"
        side="right"
      >
        <UserCard userId={member.userId} />
      </HoverCardContent>
    </HoverCard>
  );
}

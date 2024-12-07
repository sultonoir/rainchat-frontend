import React from "react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { UserProfile } from "../user/user-profile";
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

interface Props {
  isMobile: boolean;
  member: Member;
}

export function MemberCard({ isMobile, member }: Props) {
  const [open, setOpen] = React.useState(false);
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DrawerDescription>
          </DrawerHeader>
          <UserCard member={member} />
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
          <UserProfile />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        className="size-fit rounded-2xl border-none p-0"
        side="right"
      >
        <UserCard member={member} />
      </HoverCardContent>
    </HoverCard>
  );
}

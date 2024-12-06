import { cn } from "@/lib/utils";
import React from "react";
import { UserAvatar } from "./user-avatar";

interface Props extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  name?: string;
  username?: string;
  online?: boolean;
}

export function UserProfile({
  src,
  name,
  online = false,
  username,
  className,
}: Props) {
  return (
    <div className={cn("flex gap-4", className)}>
      <UserAvatar src={src} name={name} online={online} />
      <div className="flex flex-col items-start">
        <h3 className="text-sm font-bold">{username ?? "Rainchat"}</h3>
        <p className="text-sm text-muted-foreground">
          {online ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}

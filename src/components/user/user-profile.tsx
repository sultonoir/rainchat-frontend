import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import React from "react";

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
    <div className="flex gap-4">
      <div className={cn("relative flex-none flex-shrink-0", className)}>
        <Avatar>
          <AvatarImage src={src ?? "/avatar.png"} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <div className="absolute -right-1 bottom-0 z-20 size-5 rounded-full bg-secondary p-1">
          <div
            className={cn("z-30 size-full rounded-full bg-green-500", {
              "bg-accent": !online,
            })}
          />
        </div>
      </div>
      <div className="flex flex-col items-start">
        <h3 className="text-sm font-bold">{username ?? "Rainchat"}</h3>
        <p className="text-sm text-muted-foreground">
          {online ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}

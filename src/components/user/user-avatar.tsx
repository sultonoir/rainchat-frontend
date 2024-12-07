import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  name?: string;
  username?: string;
  online?: boolean;
}

export const UserAvatar = ({
  src = "/avatar.png",
  name,
  online,
  className,
}: Props) => {
  return (
    <div className={cn("relative flex-none flex-shrink-0")}>
      <Avatar className={className}>
        <AvatarImage src={src === "" ? "/avatar.png" : src} />
        <AvatarFallback>{name?.at(0) ?? "R"}</AvatarFallback>
      </Avatar>
      <div className="absolute -right-1 bottom-0 z-20 size-5 rounded-full bg-secondary p-1">
        <div
          className={cn("z-30 size-full rounded-full bg-green-500", {
            "bg-accent": !online,
          })}
        />
      </div>
    </div>
  );
};

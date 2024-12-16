import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
    <div className={cn("relative size-10 flex-none flex-shrink-0", className)}>
      <div
        className={cn(
          "relative aspect-square size-10 overflow-hidden rounded-full",
          className,
        )}
      >
        <Image
          src={src === "" ? "/avatar.png" : src}
          alt={name ?? "avatar"}
          fill
          sizes="(max-width: 768px) 120px, (max-width: 1200px) 120px, 150px"
          className="size-full object-cover"
        />
      </div>
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

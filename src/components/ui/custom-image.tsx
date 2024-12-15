import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface Props extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  name?: string;
}

export const CustomImage = ({
  src = "/avatar.png",
  name = "avatar",
  className,
}: Props) => {
  return (
    <div
      className={cn(
        "relative aspect-square size-10 overflow-hidden rounded-full",
        className,
      )}
    >
      <Image
        src={src === "" ? "/avatar.png" : src}
        alt={name}
        fill
        sizes="(max-width: 768px) 120px, (max-width: 1200px) 120px, 150px"
        className="size-full object-cover"
      />
    </div>
  );
};

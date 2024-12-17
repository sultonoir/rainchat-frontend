import useMessage from "@/hooks/use-message";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { Media } from "@/types";
import Image from "next/image";

interface Props extends React.HTMLAttributes<HTMLElement> {
  href?: string;
  name?: string;
  message?: string | null;
  media?: Media[];
  isClosed?: boolean;
}

export const MessageReplyContent: React.FC<Props> = ({
  message,
  media,
  name,
  isClosed,
  ...prop
}) => {
  const { setMessage } = useMessage();
  const handleClose = () => {
    setMessage(undefined);
  };
  return (
    <div
      {...prop}
      className={cn(
        "relative flex h-full max-h-12 min-h-10 w-full min-w-56 items-center justify-between border-l-2 border-primary bg-secondary/40 pl-4",
        prop.className,
        {
          "pr-10": isClosed,
        },
      )}
    >
      <div className="flex flex-1 flex-col items-start justify-between py-2">
        <p className="text-xs font-semibold">{name}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{message}</p>
      </div>
      {media && media?.length > 0 && (
        <div className="relative aspect-square size-11 flex-none flex-shrink-0 overflow-hidden rounded-sm">
          <Image
            fill
            src={media.at(0)?.value ?? "/avatar.png"}
            alt="media"
            className="object-cover"
          />
        </div>
      )}
      {isClosed && (
        <Button
          startContent={<XIcon size={16} />}
          size="icon"
          className="absolute right-1 top-1 size-7 rounded-full"
          variant="outline"
          onClick={handleClose}
        />
      )}
    </div>
  );
};

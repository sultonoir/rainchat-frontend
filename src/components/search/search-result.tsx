import { Messages } from "@/types";
import { motion } from "framer-motion";
import { CustomImage } from "../ui/custom-image";
import Image from "next/image";
import { fromNow } from "@/lib/from-now";
import useMessage from "@/hooks/use-message";
import { Button } from "../ui/button";
import { Reply } from "lucide-react";
import { ChatListLoader } from "../chat/chat-list-loader";
import React from "react";
import { cn } from "@/lib/utils";

interface SearchResultProp extends React.HtmlHTMLAttributes<HTMLDivElement> {
  container?: React.HTMLAttributes<HTMLDivElement>;
  messages: Messages[] | undefined;
  loading: boolean;
  close: () => void;
}

export const SearchResults = ({
  messages,
  container,
  loading,
  close,
  className,
}: SearchResultProp) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    transition={{ duration: 0.15 }}
    className={cn(
      "absolute z-50 mt-2 w-full overflow-hidden rounded-lg bg-secondary p-3 shadow-lg",
      container?.className,
    )}
  >
    <div
      className={cn(
        "flex max-h-72 w-full flex-col divide-y overflow-y-auto",
        className,
      )}
    >
      {loading ? (
        <ChatListLoader />
      ) : (
        <>
          {!messages ? (
            <div>Search chat</div>
          ) : (
            <>
              {messages.length === 0 ? (
                <div className="p-3 text-sm">Message not found</div>
              ) : (
                <>
                  {messages?.map((item) => (
                    <SeachCard message={item} key={item.id} close={close} />
                  ))}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  </motion.div>
);

interface SeachCardProps extends React.HTMLAttributes<HTMLDivElement> {
  message: Messages;
  close: () => void;
}

function SeachCard({ message, close }: SeachCardProps) {
  const { setMessage } = useMessage();
  const handleReply = () => {
    setMessage(message);
    close();
  };
  return (
    <div
      className="flex w-full gap-4 py-2 pr-2 first:pt-0 last:pb-0"
      key={message.id}
    >
      <CustomImage src={message.sender.image} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold capitalize leading-none">
            {message.sender.name}
          </p>
          <p className="leading-none text-muted-foreground">-</p>
          <p className="text-xs text-muted-foreground">
            {fromNow(new Date(message.createdAt))}
          </p>
        </div>
        <p className="line-clamp-1 text-sm">{message.content}</p>
        {message.media.length > 0 && (
          <Image
            src={message.media.at(0)?.value ?? "/logo.png"}
            alt="image"
            width={100}
            height={200}
            className="mt-2 rounded-lg object-cover"
          />
        )}
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="size-7 rounded-full"
        onClick={handleReply}
      >
        <Reply size={16} />
      </Button>
    </div>
  );
}

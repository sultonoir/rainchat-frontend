import { Messages } from "@/types";
import { motion } from "framer-motion";
import { CustomImage } from "../ui/custom-image";
import Image from "next/image";
import { fromNow } from "@/lib/from-now";
import useMessage from "@/hooks/use-message";
import { Button } from "../ui/button";
import { Reply } from "lucide-react";
import { ChatListLoader } from "../chat/chat-list-loader";

export const SearchResults = ({
  results,
  loading,
  close,
}: {
  results: Messages[] | undefined;
  loading: boolean;
  close: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    transition={{ duration: 0.15 }}
    className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg bg-secondary p-3 shadow-lg"
  >
    <div className="flex max-h-72 w-full flex-col divide-y overflow-y-auto">
      {loading ? (
        <ChatListLoader />
      ) : (
        <>
          {!results ? (
            <div>Search chat</div>
          ) : (
            <>
              {results.length === 0 ? (
                <div className="p-3 text-sm">Message not found</div>
              ) : (
                <>
                  {results?.map((item) => (
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

function SeachCard({
  message,
  close,
}: {
  message: Messages;
  close: () => void;
}) {
  const { setMessage } = useMessage();
  const handleReply = () => {
    setMessage(message);
    close();
  };
  return (
    <div className="flex gap-4 py-2 pr-2 first:pt-0 last:pb-0" key={message.id}>
      <CustomImage src={message.sender.image} />
      <div className="max-w-xs flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold capitalize leading-none">
            {message.sender.name}
          </p>
          <p className="text-muted-foreground">|</p>
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
            className="rounded-lg object-cover"
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

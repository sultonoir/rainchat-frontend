"use client";

import { ArrowRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { Button } from "../ui/button";
import { ChatInputFile } from "./chat-input-file";
import { useWebSocket } from "@/provider/socket-provider";
import { useSession } from "@/provider/session-provider";

const MIN_HEIGHT = 56;

interface Props {
  id: string;
  close: () => void;
}

export function ChatInput({ id, close }: Props) {
  const { user } = useSession();
  const { socket } = useWebSocket(); // WebSocket instance
  const [inputValue, setInputValue] = useState<string>("");

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: 200,
  });

  // Emit typing event to WebSocket
  const emitTypingEvent = useCallback(() => {
    if (inputValue.trim() && user?.name) {
      socket?.emit("typing", `${user.name} is typing`);
    }
  }, [inputValue, socket, user?.name]);

  // Emit message event to WebSocket
  const emitSendMessage = useCallback(() => {
    if (inputValue.trim() && user?.name) {
      socket?.emit("sendMessage", {
        senderId: user.id,
        media: [],
        chatId: id,
        content: inputValue.trim(),
      });
      close();
      setInputValue(""); // Reset input
      adjustHeight(true); // Adjust textarea height
    }
  }, [inputValue, user, socket, id, adjustHeight, close]);

  // Debounced typing event
  useEffect(() => {
    if (!inputValue.trim()) return;

    const timeout = setTimeout(emitTypingEvent, 300);
    return () => clearTimeout(timeout);
  }, [inputValue, emitTypingEvent]);

  // Handle key press in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      emitSendMessage();
      close();
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    adjustHeight();
  };

  return (
    <div className="flex w-full items-end gap-2">
      {/* File input component */}
      <ChatInputFile id={id} close={close} />

      {/* Text input */}
      <Textarea
        id="chat-input"
        placeholder="Send message"
        className={cn(
          "resize-none border-none bg-secondary pr-10",
          `min-h-[${MIN_HEIGHT}px]`,
        )}
        ref={textareaRef}
        value={inputValue}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
      />

      {/* Send button */}
      <Button
        className={cn(
          "mb-2 size-9 flex-none flex-shrink-0 rounded-full bg-black/5 px-1 py-1 dark:bg-white/5",
        )}
        type="button"
        onClick={emitSendMessage}
        disabled={!inputValue.trim()}
      >
        <ArrowRight
          className={cn(
            "h-4 w-4 transition-opacity dark:text-white",
            inputValue.trim() ? "opacity-100" : "opacity-30",
          )}
        />
      </Button>
    </div>
  );
}

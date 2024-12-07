"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { Button } from "../ui/button";
import { ChatInputFile } from "./chat-input-file";

const MIN_HEIGHT = 56;

export function ChatInput() {
  const [inputValue, setInputValue] = useState<string>("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: 200,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setInputValue("");
      adjustHeight(true);
    }
  };

  return (
    <div className="flex w-full items-end gap-2">
      <ChatInputFile />
      <Textarea
        id="input-09"
        placeholder="Send message"
        className={cn(
          "resize-none border-none bg-secondary pr-10",
          `min-h-[${MIN_HEIGHT}px]`,
        )}
        ref={textareaRef}
        value={inputValue}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          setInputValue(e.target.value);
          adjustHeight();
        }}
      />

      <Button
        className="mb-2 size-9 flex-none flex-shrink-0 rounded-full bg-black/5 px-1 py-1 dark:bg-white/5"
        type="button"
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

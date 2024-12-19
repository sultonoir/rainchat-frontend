"use client";
import React, { useCallback, useRef, useState } from "react";
import { Button } from "../ui/button";
import { SearchIcon, SendHorizontal } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { useDebounce } from "@/hooks/use-debounce";
import { Messages } from "@/types";
import { AnimatePresence } from "framer-motion";
import { SearchResults } from "./search-result";

interface Props {
  chatId: string;
}

export const SearchInput = ({ chatId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedInputValue = useDebounce(inputValue, 300);

  useClickOutside(containerRef, () => setIsOpen(false));

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setInputValue("");
        setIsOpen(false);
      }
    },
    [inputValue],
  );

  const handleSearchSubmit = () => {
    if (!inputValue.trim()) return;
    setInputValue("");
    setIsOpen(false);
  };

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search-chat", chatId, debouncedInputValue],
    queryFn: async () => {
      if (!debouncedInputValue) return;
      setIsOpen(true);
      return await ky
        .get(`/v1/chat/${chatId}/search`, {
          searchParams: { q: debouncedInputValue },
        })
        .json<Messages[]>();
    },
    enabled: !!debouncedInputValue,
  });

  return (
    <div className="relative hidden md:block" ref={containerRef}>
      <div className="relative rounded-lg bg-secondary">
        <div className="flex h-auto min-h-[48px] flex-wrap items-center gap-2 px-3 py-2">
          <div className="flex items-center gap-2 rounded-md bg-black/10 px-2 py-1 text-sm dark:bg-white/10">
            <span className="flex flex-shrink-0 items-center gap-1.5">
              <SearchIcon className="h-4 w-4 text-black/50 dark:text-white/50" />
              <span className="text-black/70 dark:text-white/70">Search</span>
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <input
              ref={inputRef}
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(true)}
              placeholder="Search..."
              className="text-md flex-1 border-none bg-transparent text-black outline-none placeholder:text-sm placeholder:text-black/60 dark:text-white dark:placeholder:text-white/60"
            />
            <Button
              size="icon"
              variant={inputValue.trim() === "" ? "ghost" : "glow"}
              type="button"
              onClick={handleSearchSubmit}
              startContent={<SendHorizontal className="size-4" />}
              className={cn("size-7", {
                "text-muted-foreground": inputValue.trim() === "",
              })}
            />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <SearchResults
            messages={searchResults}
            loading={isLoading}
            close={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

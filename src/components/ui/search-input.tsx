"use client";

import { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SendHorizontal, SearchIcon } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { fromNow } from "@/lib/from-now";
import { CustomImage } from "./custom-image";
import Image from "next/image";

export function SearchInput() {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  useClickOutside(containerRef, () => {
    if (isOpen) setIsOpen(false);
  });

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

  const handleButtonClick = () => {
    if (!inputValue.trim()) return;
    setInputValue("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
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
              onClick={handleButtonClick}
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
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg bg-secondary p-3 shadow-lg"
          >
            <div className="flex max-h-72 w-full flex-col overflow-y-auto">
              <div className="flex gap-4 pr-2">
                <CustomImage />
                <div className="max-w-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold leading-none">Sulton</p>
                    <p className="text-xs text-muted-foreground">
                      {fromNow(new Date())}
                    </p>
                  </div>
                  <p className="line-clamp-1 text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Illum, architecto odio nulla eius itaque mollitia dicta
                    necessitatibus velit facere! Quis?
                  </p>
                  <Image
                    src="https://utfs.io/f/lU4D66pu7X2kWXxGUpIHuqLCcAr4diRHpMP7ynNJG9kIf5SQ"
                    alt="image"
                    width={100}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <Image
                    src="https://utfs.io/f/lU4D66pu7X2keUJsDd27wv4A3QGDOXhcjVSFtoY5p6JW7fBd"
                    alt="image"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

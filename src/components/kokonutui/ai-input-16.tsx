"use client";

import { useState, useRef, useCallback } from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Wand2, Search, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";

const COMMANDS = [
  {
    id: "chat",
    label: "Chat",
    description: "Start a conversation",
    icon: MessageSquare,
    prefix: "/chat",
  },
  {
    id: "generate",
    label: "Generate",
    description: "Generate code or content",
    icon: Wand2,
    prefix: "/generate",
  },
  {
    id: "analyze",
    label: "Analyze",
    description: "Analyze code or text",
    icon: Search,
    prefix: "/analyze",
  },
];

export default function AIInput_16() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCommand, setActiveCommand] = useState<string | null>(null);
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
        if (!inputValue.trim() && !activeCommand) return;

        setInputValue("");
        setActiveCommand(null);
      }

      if (e.key === "Backspace" && inputValue === "" && activeCommand) {
        setActiveCommand(null);
      }
    },
    [activeCommand, inputValue],
  );

  const handleCommandSelect = (commandId: string) => {
    const command = COMMANDS.find((cmd) => cmd.id === commandId);
    if (command) {
      setInputValue("");
      setActiveCommand(commandId);
      setIsOpen(false);
      inputRef.current?.focus();
    }
  };

  const handleButtonClick = () => {
    if (!inputValue.trim() && !activeCommand) return;
    setInputValue("");
    setIsOpen(false);
    setActiveCommand(null);
  };

  return (
    <div className="min-h-[244px] w-full py-4">
      <div className="relative" ref={containerRef}>
        <div className="relative rounded-lg bg-black/5 dark:bg-white/5">
          <div className="flex h-auto min-h-[48px] flex-wrap items-center gap-2 px-3 py-2">
            {activeCommand &&
              (() => {
                const activeCmd = COMMANDS.find(
                  (cmd) => cmd.id === activeCommand,
                );
                if (!activeCmd) return null;

                return (
                  <div className="flex items-center gap-2 rounded-md bg-black/10 px-2 py-1 text-sm dark:bg-white/10">
                    <span className="flex flex-shrink-0 items-center gap-1.5">
                      <activeCmd.icon className="h-4 w-4 text-black/50 dark:text-white/50" />
                      <span className="text-black/70 dark:text-white/70">
                        {activeCmd.label}
                      </span>
                    </span>
                  </div>
                );
              })()}
            <div className="flex flex-1 items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => !activeCommand && setIsOpen(true)}
                placeholder={
                  activeCommand
                    ? "Type your message..."
                    : "Type / for commands..."
                }
                className="text-md flex-1 border-none bg-transparent text-black outline-none placeholder:text-black/60 dark:text-white dark:placeholder:text-white/60"
              />
              <button
                type="button"
                onClick={handleButtonClick}
                className={cn(
                  "flex-shrink-0 rounded-md p-1.5 transition-colors",
                  inputValue || activeCommand
                    ? "bg-sky-500/15 text-sky-500"
                    : "text-black/50 hover:text-black/70 dark:text-white/50 dark:hover:text-white/70",
                )}
              >
                <SendHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && !activeCommand && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute mt-2 w-full overflow-hidden rounded-lg bg-black/5 shadow-lg dark:bg-white/5"
            >
              <Command className="w-full">
                <Command.List className="py-2">
                  {COMMANDS.map((command) => (
                    <Command.Item
                      key={command.id}
                      onSelect={() => handleCommandSelect(command.id)}
                      className="group flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <command.icon className="h-4 w-4 text-black/50 group-hover:text-black/70 dark:text-white/50 dark:group-hover:text-white/70" />
                      <div className="flex flex-col">
                        <span className="font-medium text-black/70 dark:text-white/70">
                          {command.label}
                        </span>
                        <span className="text-xs text-black/50 dark:text-white/50">
                          {command.description}
                        </span>
                      </div>
                      <span className="ml-auto text-xs text-black/30 dark:text-white/30">
                        {command.prefix}
                      </span>
                    </Command.Item>
                  ))}
                </Command.List>
              </Command>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

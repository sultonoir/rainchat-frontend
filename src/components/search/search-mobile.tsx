"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSeacrch } from "@/hooks/use-search-dialog";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Button } from "../ui/button";
import { ArrowLeft, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { Messages } from "@/types";
import { SearchResults } from "./search-result";

interface Props {
  chatId: string;
}

export const SearchMobile = ({ chatId }: Props) => {
  const { openStates, setOpen } = useSeacrch();
  const isOpen = openStates[chatId] ?? false;
  const isMobile = useIsMobile();
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { mutate, data, isPending } = useMutation({
    mutationKey: ["search", chatId],
    mutationFn: async () => {
      return await ky
        .get(`/v1/chat/${chatId}/search`, {
          searchParams: { q: inputValue },
        })
        .json<Messages[]>();
    },
    onSuccess() {
      setInputValue("");
      if (inputRef.current) {
        inputRef.current.value = ""; // Reset nilai input
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-50 h-dvh w-full overflow-hidden rounded-lg bg-secondary p-3 shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex w-full items-center gap-2">
                <Button
                  startContent={<ArrowLeft size={16} />}
                  size="icon"
                  variant="glow"
                  className="flex-none rounded-full"
                  onClick={() => setOpen(chatId, false)}
                />
                <div className="relative flex-1 rounded-lg border bg-secondary">
                  <div className="flex h-auto min-h-[48px] items-center gap-2 px-3 py-2">
                    <form
                      onSubmit={handleSubmit}
                      className="flex w-full items-center gap-2"
                    >
                      <input
                        ref={inputRef}
                        type="search"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Search..."
                        className="text-md flex-1 border-none bg-transparent text-black outline-none placeholder:text-sm placeholder:text-black/60 dark:text-white dark:placeholder:text-white/60"
                      />
                      <Button
                        size="icon"
                        variant={inputValue.trim() === "" ? "ghost" : "glow"}
                        type="submit"
                        startContent={<SendHorizontal className="size-4" />}
                        className={cn("size-7", {
                          "text-muted-foreground": inputValue.trim() === "",
                        })}
                      />
                    </form>
                  </div>
                </div>
              </div>
              <div className="relative flex h-[90dvh] flex-col overflow-y-auto">
                {data && (
                  <SearchResults
                    messages={data}
                    loading={isPending}
                    close={() => setOpen(chatId, false)}
                    className="max-h-max"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

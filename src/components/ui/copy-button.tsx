"use client";

import React, { useState } from "react";
import { Button } from "./button";
import { Check, Link } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  function getBaseUrl() {
    if (typeof window !== "undefined") return window.location.origin;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return `http://localhost:${process.env.PORT ?? 3000}`;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getBaseUrl() + `/invite/${code}`); // Menyalin URL ke clipboard
      setCopied(true);

      // Reset notifikasi setelah beberapa detik
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Gagal menyalin tautan:", error);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          startContent={copied ? <Check size={16} /> : <Link size={16} />}
          variant="ghost"
          className="flex-none rounded-full"
          size="icon"
          onClick={handleCopy}
        />
      </TooltipTrigger>
      <TooltipContent>
        <p>Copy link invite</p>
      </TooltipContent>
    </Tooltip>
  );
};

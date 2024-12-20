"use client";
import { fromNow } from "@/lib/from-now";
import React, { useEffect, useState } from "react";

export const LastOnline = ({ last }: { last: Date }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <p className="text-xs text-muted-foreground">
      {fromNow(new Date(last ?? new Date()))}
    </p>
  );
};

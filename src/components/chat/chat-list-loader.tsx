import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface Props {
  count?: number;
}

export function ChatListLoader({ count = 10 }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex w-full gap-4 rounded-2xl">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

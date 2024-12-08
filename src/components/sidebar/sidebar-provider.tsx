"use client";

import { useSidebar } from "../../hooks/use-sidebar";
import { Sidebar } from "@/components/sidebar/sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function SidebarProvider({ children }: LayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex h-svh overflow-hidden">
      <div
        className={cn(
          "ease-[cubic-bezier(0.4, 0.0, 0.2, 1)] fixed left-0 top-0 z-10 h-full w-full bg-secondary shadow-xl transition-all duration-300 will-change-transform md:w-[350px]",
          {
            "-translate-x-full opacity-0": !isOpen,
            "translate-x-0 opacity-100": isOpen,
          },
        )}
      >
        <Sidebar />
      </div>
      <div
        className={cn(
          "ease-[cubic-bezier(0.4, 0.0, 0.2, 1)] flex-1 transition-all duration-300 will-change-transform",
          {
            "ml-[350px]": isOpen,
            "ml-0": !isOpen,
          },
        )}
      >
        {children}
      </div>
    </div>
  );
}

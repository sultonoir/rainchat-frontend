import { SidebarProvider } from "@/components/sidebar/sidebar-provider";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <SidebarProvider>{children}</SidebarProvider>;
}

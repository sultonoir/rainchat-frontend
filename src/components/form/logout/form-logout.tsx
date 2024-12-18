"use client";
import { Button } from "@/components/ui/button";
import { logout } from "@/server/routes/auth/logout";
import { LogOutIcon } from "lucide-react";
import React from "react";

export const FormLogout = () => {
  return (
    <Button
      variant="glow"
      onClick={logout}
      size="icon"
      className="rounded-full"
    >
      <LogOutIcon />
    </Button>
  );
};

"use client";
import { Button } from "@/components/ui/button";
import { logout } from "@/server/routes/auth/logout";
import React from "react";

export const FormLogout = () => {
  return (
    <Button variant="glow" onClick={logout}>
      Signout
    </Button>
  );
};

"use client";
import { Button } from "@/components/ui/button";
import { demo } from "@/server/routes/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export const FormDemo = () => {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationKey: ["signin"],
    mutationFn: demo,
    onError(data) {
      toast.error(data.message);
    },
    onSuccess() {
      router.refresh();
    },
  });

  const handleClick = () => {
    mutate();
  };
  return (
    <Button
      onClick={handleClick}
      loading={isPending}
      disabled={isPending}
      className="w-full"
      variant="outline"
    >
      Signin with demo
    </Button>
  );
};

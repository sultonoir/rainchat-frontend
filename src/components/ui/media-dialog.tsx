"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaDialog } from "@/hooks/use-media-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const MediaDialog = () => {
  const { setShow, setMedia, show, media } = useMediaDialog();

  const handleClose = (value: boolean) => {
    if (!value) {
      setMedia(undefined);
    }
    setShow(value);
  };
  return (
    <Dialog onOpenChange={handleClose} open={show}>
      <DialogContent>
        <DialogHeader className="sr-only">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <Avatar className="size-full rounded-none">
          <AvatarImage
            className="size-full rounded-none"
            alt="Image Cropper Shell"
            src={media}
          />
          <AvatarFallback className="size-full min-h-[460px] rounded-none">
            Loading...
          </AvatarFallback>
        </Avatar>
      </DialogContent>
    </Dialog>
  );
};

import useImages from "@/hooks/use-images";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, buttonVariants } from "../ui/button";
import { ImagePlus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-is-mobile";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useWebSocket } from "@/provider/socket-provider";
import { useUploadThing } from "@/lib/uploadthing";
import { useSession } from "@/provider/session-provider";
import useMessage from "@/hooks/use-message";

interface Props {
  id: string;
  close: () => void;
}

export const ChatInputFile = ({ id, close }: Props) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { images, setImages } = useImages();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Hitung jumlah file yang dapat ditambahkan
      const remainingSlots = 4 - images.length;

      if (remainingSlots <= 0) {
        // Jika sudah mencapai batas, tidak menambahkan file
        return;
      }

      // Batasi file baru sesuai dengan slot yang tersisa
      const limitedFiles = acceptedFiles.slice(0, remainingSlots);

      // Filter file unik
      const uniqueNewFiles = limitedFiles.filter(
        (file) =>
          !images.some((existingFile) => existingFile.name === file.name),
      );

      // Update state dengan file baru
      setImages([...images, ...uniqueNewFiles]);
      setOpen(true);
    },
    [images, setImages], // Menjaga agar dependencies tetap diperbarui
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const handleClose = (value: boolean) => {
    if (!value) {
      setImages([]);
    }
    setOpen(value);
  };

  return (
    <div>
      <Label
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-9 cursor-pointer",
        )}
        {...getRootProps}
      >
        <ImagePlus />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          {...getInputProps()}
        />
      </Label>
      {isMobile ? (
        <DrawerInput
          open={open}
          onOpenChange={handleClose}
          id={id}
          close={close}
        />
      ) : (
        <DialogInput
          open={open}
          onOpenChange={handleClose}
          id={id}
          close={close}
        />
      )}
    </div>
  );
};

interface DialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  id: string;
  close: () => void;
}

function DialogInput({ onOpenChange, open, id, close }: DialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
          <DialogDescription className="sr-only">create chat</DialogDescription>
        </DialogHeader>
        <FormSendMessage
          open={open}
          onOpenChange={onOpenChange}
          id={id}
          close={close}
        />
      </DialogContent>
    </Dialog>
  );
}

function DrawerInput({ onOpenChange, open, id, close }: DialogProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Send message</DrawerTitle>
          <DrawerDescription className="sr-only">Chat Input</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <FormSendMessage
            open={open}
            onOpenChange={onOpenChange}
            id={id}
            close={close}
          />
        </div>
        <DrawerFooter>
          <Button variant="outline" className="w-full">
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function FormSendMessage({ onOpenChange, close, id }: DialogProps) {
  const { message, setMessage } = useMessage();
  const [isPending, setIsPending] = useState(false);
  const { user } = useSession();
  const { startUpload } = useUploadThing("media");
  const { socket } = useWebSocket();
  const [content, setContent] = useState("");
  const { images, setImages } = useImages();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Hitung jumlah file yang dapat ditambahkan
      const remainingSlots = 4 - images.length;

      if (remainingSlots <= 0) {
        // Jika sudah mencapai batas, tidak menambahkan file
        return;
      }

      // Batasi file baru sesuai dengan slot yang tersisa
      const limitedFiles = acceptedFiles.slice(0, remainingSlots);

      // Filter file unik
      const uniqueNewFiles = limitedFiles.filter(
        (file) =>
          !images.some((existingFile) => existingFile.name === file.name),
      );

      // Update state dengan file baru
      setImages([...images, ...uniqueNewFiles]);
    },
    [images, setImages], // Menjaga agar dependencies tetap diperbarui
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const handleRevome = (name: string) => {
    setImages(images.filter((i) => i.name !== name));
  };

  const handleSumbit = async () => {
    let imageUploaded: string[] = [];
    setIsPending(true);
    try {
      const result = await startUpload(images);
      imageUploaded = result?.map((item) => item.url) ?? [];
    } catch (error) {
      console.log(error);
    }
    socket?.emit("sendMessage", {
      senderId: user?.id,
      media: imageUploaded,
      chatId: id,
      content: content.trim(),
      replyToId: message?.id,
    });
    setIsPending(false);
    close();
    setContent("");
    onOpenChange(false);
    setMessage(undefined);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <ul className="grid grid-cols-2 gap-4">
        {images.map((item) => (
          <li
            key={item.name}
            className="relative aspect-square overflow-hidden rounded-lg"
          >
            <Button
              size="icon"
              variant="destructive"
              className="absolute right-1 top-1 z-10"
              onClick={() => handleRevome(item.name)}
            >
              <Trash2 />
            </Button>
            <Image
              src={URL.createObjectURL(item)}
              alt={item.name}
              fill
              className="size-full object-cover"
            />
          </li>
        ))}
        <Label
          className="flex aspect-square items-center justify-center rounded-lg border border-dashed"
          {...getRootProps}
        >
          <ImagePlus />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            {...getInputProps()}
          />
        </Label>
      </ul>
      <div className="flex w-full gap-2">
        <Input value={content} onChange={(e) => setContent(e.target.value)} />
        <Button disabled={isPending} loading={isPending} onClick={handleSumbit}>
          Sumbit
        </Button>
      </div>
    </div>
  );
}

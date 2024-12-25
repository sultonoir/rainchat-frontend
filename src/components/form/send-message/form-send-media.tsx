import useImages from "@/hooks/use-images";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, buttonVariants } from "@/components/ui/button";
import { ImagePlus, SendHorizontal, Trash2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { useWebSocket } from "@/provider/socket-provider";
import { useUploadThing } from "@/lib/uploadthing";
import { useSession } from "@/provider/session-provider";
import useMessage from "@/hooks/use-message";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "@/components/ui/emoji-picker";

interface Props {
  id: string;
  close: () => void;
}

export const FormSendMedia = ({ id, close }: Props) => {
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
          "size-9 cursor-pointer rounded-full",
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
        <div className="flex flex-col gap-2 p-4 pb-0">
          <Gallery />
          <FormSendMessage
            open={open}
            onOpenChange={onOpenChange}
            id={id}
            close={close}
          />
        </div>
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
        <div className="flex flex-col gap-2 p-4 pb-0">
          <Gallery />
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

function Gallery() {
  const { images, setImages } = useImages();
  const handleRevome = (name: string) => {
    setImages(images.filter((i) => i.name !== name));
  };

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

  return (
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
  );
}

function FormSendMessage({ onOpenChange, close, id }: DialogProps) {
  const MIN_HEIGHT = 36;
  const { message, setMessage } = useMessage();
  const [isPending, setIsPending] = useState(false);
  const { user } = useSession();
  const { startUpload } = useUploadThing("media");
  const { socket } = useWebSocket();
  const [content, setContent] = useState("");
  const { images } = useImages();
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: 200,
  });

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

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSumbit();
      close();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    adjustHeight();
  };

  return (
    <div className="flex w-full flex-col rounded-lg border p-1">
      <Textarea
        id="chat-input"
        placeholder="Send message"
        className={cn(
          "resize-none border-none bg-transparent pr-10",
          `min-h-[${MIN_HEIGHT}px]`,
        )}
        ref={textareaRef}
        value={content}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
      />
      <div className="flex items-center justify-between">
        <EmojiPicker
          onChange={(value) => {
            setContent(content + value);
          }}
        />
        <Button
          disabled={isPending}
          loading={isPending}
          onClick={handleSumbit}
          size="icon"
          variant={content.trim() === "" ? "ghost" : "glow"}
          type="button"
          startContent={<SendHorizontal className="size-4" />}
          className={cn("size-8 rounded-full", {
            "text-muted-foreground": content.trim() === "",
          })}
        />
      </div>
    </div>
  );
}

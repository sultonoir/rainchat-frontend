"use client";

import React, { type SyntheticEvent } from "react";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import "react-image-crop/dist/ReactCrop.css";
import { CropIcon, ImagePlus, Trash2Icon } from "lucide-react";
import { FileWithPreview } from "./demo-crop";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface ImageCropperProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFile: FileWithPreview | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileWithPreview | null>>;
  handleCropComplete: (croppedImageUrl: string, name: string) => void; // Declare it here
}

export function ImageCropper({
  dialogOpen,
  setDialogOpen,
  selectedFile,
  setSelectedFile,
  handleCropComplete, // Accept the callback prop
}: ImageCropperProps) {
  const aspect = 1;

  const imgRef = React.useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = React.useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>("");
  const [croppedImage, setCroppedImage] = React.useState<string>("");

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop);
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
      );
    }

    return canvas.toDataURL("image/png", 1.0);
  }

  function onCrop() {
    setCroppedImage(croppedImageUrl);
    setDialogOpen(false);
    handleCropComplete(
      croppedImageUrl,
      selectedFile?.name ?? "cropped-image.png",
    ); // Call the callback passed by the parent
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setSelectedFile(fileWithPreview);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <Avatar className="size-36 cursor-pointer ring-2 ring-slate-200 ring-offset-2">
          <AvatarImage
            src={croppedImage ? croppedImage : selectedFile?.preview}
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent className="gap-0 p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Crop your image</DialogTitle>
          <DialogDescription>
            Adjust and crop your image before saving.
          </DialogDescription>
        </DialogHeader>
        <div className="size-full p-6">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={onCropComplete}
            aspect={aspect}
            className="w-full"
          >
            <Avatar className="size-full rounded-none">
              <AvatarImage
                ref={imgRef}
                className="size-full rounded-none"
                alt="Image Cropper Shell"
                src={selectedFile?.preview}
                onLoad={onImageLoad}
              />
              <AvatarFallback className="size-full min-h-[460px] rounded-none">
                Loading...
              </AvatarFallback>
            </Avatar>
          </ReactCrop>
        </div>
        <DialogFooter className="justify-center p-6 pt-0">
          <DialogClose asChild>
            <Button
              size={"sm"}
              type="reset"
              className="w-fit"
              variant={"outline"}
              onClick={() => {
                setSelectedFile(null);
              }}
            >
              <Trash2Icon className="mr-1.5 size-4" />
              Cancel
            </Button>
          </DialogClose>
          <Label
            htmlFor="upload"
            className={cn(
              "cursor-pointer hover:opacity-80",
              buttonVariants({ variant: "glow" }),
            )}
          >
            <input
              id="upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onFileChange}
            />
            <ImagePlus size={16} />
            Change image
          </Label>
          <Button type="submit" size={"sm"} className="w-fit" onClick={onCrop}>
            <CropIcon className="mr-1.5 size-4" />
            Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to center the crop
export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 50,
        height: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

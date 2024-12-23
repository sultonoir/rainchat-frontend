"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileWithPath, useDropzone } from "react-dropzone";
import { ImageCropper } from "./image-cropper";
import { stringToFile } from "@/lib/stringToFile";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

const accept = {
  "image/*": [],
};

export function DemoCrop() {
  const [selectedFile, setSelectedFile] =
    React.useState<FileWithPreview | null>(null);
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  // Callback to handle the cropped image URL from ImageCropper
  const handleCropComplete = (croppedImageUrl: string) => {
    stringToFile(croppedImageUrl, "");
  };

  const onDrop = React.useCallback((acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      alert("Selected image is too large!");
      return;
    }

    const fileWithPreview = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    setSelectedFile(fileWithPreview);
    setDialogOpen(true);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });

  return (
    <div className="relative">
      {selectedFile ? (
        <ImageCropper
          dialogOpen={isDialogOpen}
          setDialogOpen={setDialogOpen}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          handleCropComplete={handleCropComplete} // Pass the callback to ImageCropper
        />
      ) : (
        <Avatar
          {...getRootProps()}
          className="size-36 cursor-pointer ring-2 ring-slate-200 ring-offset-2"
        >
          <input {...getInputProps()} />
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

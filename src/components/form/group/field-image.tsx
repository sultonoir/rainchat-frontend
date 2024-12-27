"use client";

import React from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { stringToFile } from "@/lib/stringToFile";
import { ImageCropper } from "@/components/ui/image-cropper";
import { cn } from "@/lib/utils";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

const accept = {
  "image/*": [],
};

interface FieldImageProps extends React.HTMLAttributes<HTMLElement> {
  images: File[];
  setImages: (values: File[]) => void;
  placeholder?: string;
}

export default function FieldImage({
  setImages,
  images,
  className,
  placeholder = "Drag 'n' drop some images here, or click to select images",
}: FieldImageProps) {
  const [selectedFile, setSelectedFile] =
    React.useState<FileWithPreview | null>(null);
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const handleCropComplete = (croppedImageUrl: string, name: string) => {
    const file = stringToFile(croppedImageUrl, name);
    setImages([file]);
  };

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return;
      }

      const file = acceptedFiles[0]; // Hanya ambil file pertama

      if (!file) {
        return;
      }

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      setSelectedFile(fileWithPreview);
      setDialogOpen(true);
      setImages([file]); // Tetap set dalam array untuk konsistensi
    },
    [setImages],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  return (
    <div className="space-y-4">
      {images.length > 0 ? (
        <div className="flex items-center justify-center">
          <ImageCropper
            dialogOpen={isDialogOpen}
            setDialogOpen={setDialogOpen}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            handleCropComplete={handleCropComplete} // Pass the callback to ImageCropper
          />
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
            className,
            {
              "border-primary bg-primary/10": isDragActive,
              "border-border": !isDragActive,
            },
          )}
        >
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            {...getInputProps()}
          />
          <Upload className="mx-auto h-12 w-12" />
          <p className="mt-2 text-sm">
            {isDragActive ? "Drop the images here ..." : placeholder}
          </p>
        </div>
      )}
    </div>
  );
}

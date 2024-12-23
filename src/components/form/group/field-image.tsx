"use client";

import React from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { stringToFile } from "@/lib/stringToFile";
import { ImageCropper } from "@/components/ui/image-cropper";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

const accept = {
  "image/*": [],
};

interface FieldImageProps {
  images: File[];
  setImages: (values: File[]) => void;
}

export default function FieldImage({ setImages, images }: FieldImageProps) {
  const [selectedFile, setSelectedFile] =
    React.useState<FileWithPreview | null>(null);
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const handleCropComplete = (croppedImageUrl: string) => {
    const file = stringToFile(croppedImageUrl, "");
    setImages([file])
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
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragActive ? "border-primary bg-primary/10" : "border-border"
          }`}
        >
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            {...getInputProps()}
          />
          <Upload className="mx-auto h-12 w-12" />
          <p className="mt-2 text-sm">
            {isDragActive
              ? "Drop the images here ..."
              : "Drag 'n' drop some images here, or click to select images"}
          </p>
        </div>
      )}
    </div>
  );
}

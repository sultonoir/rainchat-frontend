"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import Image from "next/image";

interface FieldImageProps {
  images: File[];
  setImages: (values: File[]) => void;
}

export function FieldBanner({ setImages, images }: FieldImageProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return;
      }

      const file = acceptedFiles[0]; // Hanya ambil file pertama

      if (!file) {
        return;
      }

      setImages([file]); // Tetap set dalam array untuk konsistensi
    },
    [setImages],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div className="space-y-4">
      {images.length > 0 ? (
        <div
          {...getRootProps()}
          className="relative aspect-video h-[100px] w-full overflow-hidden rounded-lg border"
        >
          <input type="file" accept="image/*" {...getInputProps()} />
          {images.map((item) => (
            <Image
              src={URL.createObjectURL(item)}
              key={item.name}
              alt={item.name}
              fill
              className="object-cover"
            />
          ))}
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

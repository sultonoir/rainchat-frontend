"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FieldImageProps {
  images: File[];
  setImages: (values: File[]) => void;
}

export default function FieldImage({ setImages, images }: FieldImageProps) {
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
        <Avatar
          {...getRootProps()}
          className="mx-auto size-36 cursor-pointer ring-2 ring-slate-200 ring-offset-2"
        >
          <input type="file" accept="image/*" {...getInputProps()} />
          {images.map((item) => (
            <AvatarImage
              src={URL.createObjectURL(item)}
              alt="@shadcn"
              key={item.name}
              className="object-cover"
            />
          ))}
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
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

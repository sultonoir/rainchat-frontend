"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2 } from "lucide-react";
import React, { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { getGlobalError } from "@/lib/getGlobalError";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import FieldImage from "../group/field-image";
import { FieldBanner } from "./field-banner";
import { useSession } from "@/provider/session-provider";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  images: z.array(z.instanceof(File)),
  baner: z.array(z.instanceof(File)),
});

export function FormEditUser() {
  const { user } = useSession();
  const { startUpload } = useUploadThing("media");
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      images: [],
      baner: [],
    },
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async (data: {
      name: string;
      image?: string;
      baner?: string;
    }) => ky.patch("/v1/user/", { json: data }).json(),
    onError: async (error) => {
      const message = await getGlobalError(error);
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      form.reset();
      setOpen(false);
      router.refresh();
    },
  });

  const uploadFiles = async (files: File[]) => {
    try {
      const upload = await startUpload(files);
      return upload?.[0]?.url;
    } catch (error) {
      const message = await getGlobalError(error);
      toast.error(message);
      return undefined;
    }
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const image =
      data.images.length > 0 ? await uploadFiles(data.images) : undefined;
    const baner =
      data.baner.length > 0 ? await uploadFiles(data.baner) : undefined;

    mutate({ name: data.name, image, baner });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7">
          <Edit2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription className="sr-only">
            Update your profile details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="baner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Baner</FormLabel>
                  <FormControl>
                    <FieldBanner
                      setImages={field.onChange}
                      images={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <FieldImage
                      setImages={field.onChange}
                      images={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={form.formState.isSubmitting || isPending}
              loading={form.formState.isSubmitting || isPending}
              type="submit"
              className="w-full"
            >
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

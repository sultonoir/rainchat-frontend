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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import FieldImage from "../group/field-image";
import { Chatlist, ChatWithMember, Group } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  image: z.array(z.instanceof(File)),
  desc: z.string().optional(),
});

interface Props {
  id: string;
  name: string;
  image: string;
  desc?: string;
}

export function FormEditGroup({ name, image, desc, id }: Props) {
  const { startUpload } = useUploadThing("media");
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name,
      image: [],
      desc,
    },
  });

  const ctx = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async (data: {
      name: string;
      image?: string;
      baner?: string;
      desc?: string;
    }) => ky.patch(`/v1/group/${id}`, { json: data }).json<Group>(),
    onError: async (error) => {
      const message = await getGlobalError(error);
      toast.error(message);
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      form.reset();
      setOpen(false);
      ctx.setQueryData<Chatlist[]>(["chatlist"], (oldData) => {
        if (!oldData) {
          return [];
        }

        const exist = oldData.some((o) => o.id === data.id);

        return exist
          ? oldData.map((item) =>
              item.id === data.id
                ? { ...item, name: data.name, image: data.image }
                : item,
            )
          : [...oldData];
      });

      ctx.setQueryData<ChatWithMember>([id], (oldData) => {
        if (!oldData) {
          return;
        }

        return {
          ...oldData,
          name: data.name,
          image: data.image,
          desc: data.desc,
        };
      });

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
      data.image.length > 0 ? await uploadFiles(data.image) : undefined;

    const desc = data.desc !== "" ? data.desc : undefined;

    mutate({ name: data.name, image, desc });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Edit2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription className="sr-only">
            Update your profile details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center gap-5">
                      <Image
                        src={image === "" ? "/avatar.png" : image}
                        alt="image-group"
                        width={144}
                        height={144}
                        className="flex-none rounded-full"
                      />
                      <FieldImage
                        setImages={field.onChange}
                        images={field.value}
                        className="flex size-36 flex-col items-center justify-center rounded-full p-2"
                        placeholder="Upload"
                      />
                    </div>
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
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desc</FormLabel>
                  <FormControl>
                    <Input placeholder="desc" {...field} />
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

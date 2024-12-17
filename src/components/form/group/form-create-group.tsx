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
import { MessagesSquareIcon } from "lucide-react";
import React from "react";
import FieldImage from "./field-image";
import { useUploadThing } from "@/lib/uploadthing";
import { getGlobalError } from "@/lib/getGlobalError";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import { Chatlist } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  images: z.array(z.instanceof(File)),
});

export function FormCreatGroup() {
  const { startUpload } = useUploadThing("media");
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      images: [],
    },
  });

  const ctx = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["create-group"],
    mutationFn: async function createGrop(data: {
      name: string;
      image: string;
    }) {
      return await ky
        .post("/v1/group", {
          json: data,
        })
        .json<Chatlist>();
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(data) {
      form.reset();
      setOpen(false);
      ctx.setQueryData<Chatlist[]>(["chatlist"], (oldData) => {
        if (!oldData) {
          return [data];
        }

        const exist = oldData.some((o) => o.id === data.id);

        return exist
          ? oldData.map((item) =>
              item.id === data.id ? { ...item, ...data } : item,
            )
          : [data, ...oldData];
      });
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let image = "";

    try {
      const upload = await startUpload(data.images);
      image = upload?.at(0)?.url ?? "";
    } catch (error) {
      const message = await getGlobalError(error);
      toast.error(message);
    }

    mutate({ image, name: data.name });
  }

  const disable = form.formState.isSubmitting ?? isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="create group">
              <MessagesSquareIcon />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create Group</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription className="sr-only">
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
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
              loading={disable}
              disabled={disable}
              type="submit"
              className="w-full"
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

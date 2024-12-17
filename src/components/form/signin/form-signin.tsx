"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { SigninSchema } from "@/server/routes/auth/auth.input";
import { PasswordInput } from "@/components/ui/input-password";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/server/routes/auth/auth.service";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export function FormSignin() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const form = useForm<SigninSchema>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["signin"],
    mutationFn: login,
    onError(data) {
      toast.error(data.message);
    },
    onSuccess() {
      if (code) {
        router.push(`/chat/${code}`);
      }
      router.refresh();
    },
  });

  async function onSubmit(data: SigninSchema) {
    mutate(data);
  }

  const disable = isPending || form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={disable}
          loading={disable}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}

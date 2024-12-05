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
import { SignupSchema } from "@/server/routes/auth/auth.input";
import { PasswordInput } from "@/components/ui/input-password";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/server/routes/auth/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function FormSignup() {
  const form = useForm<SignupSchema>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      name: "",
    },
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["signin"],
    mutationFn: signup,
    onError(data) {
      toast.error(data.message);
    },
    onSuccess() {
      router.refresh();
    },
  });

  async function onSubmit(data: SignupSchema) {
    mutate(data);
  }

  const disable = isPending || form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
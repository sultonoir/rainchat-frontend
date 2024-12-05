import { z } from "zod";

export const SigninSchema = z.object({
  email: z.string().email({ message: "Please enter valid email address" }),
  password: z.string().min(1, {
    message: "password must have 6 character",
  }),
});

export type SigninSchema = z.infer<typeof SigninSchema>;

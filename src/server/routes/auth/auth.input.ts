import { z } from "zod";

export const SigninSchema = z.object({
  email: z.string().email({ message: "Please enter valid email address" }),
  password: z.string().min(1, {
    message: "password must have 6 character",
  }),
});

export type SigninSchema = z.infer<typeof SigninSchema>;

export const SignupSchema = z.object({
  name: z.string().min(4, {
    message: "name min must have 4 character",
  }),
  email: z.string().email({ message: "Please enter valid email address" }),
  password: z.string().min(1, {
    message: "password must have 6 character",
  }),
  username: z.string().min(4, {
    message: "name min must have 4 character",
  }),
});

export type SignupSchema = z.infer<typeof SignupSchema>;

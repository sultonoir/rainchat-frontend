import ky from "ky";
import { SigninSchema, SignupSchema } from "./auth.input";
import { getGlobalError } from "@/lib/getGlobalError";

export async function login(data: SigninSchema) {
  try {
    await ky.post("/v1/auth/login", {
      json: data,
    });
  } catch (error) {
    const message = await getGlobalError(error);
    throw new Error(message);
  }
}

export async function signup(data: SignupSchema) {
  try {
    await ky.post("/v1/auth/signup", {
      json: data,
    });
  } catch (error) {
    const message = await getGlobalError(error);
    throw new Error(message);
  }
}

export async function demo() {
  const data = {
    email: process.env.NEXT_PUBLIC_DEMO_EMAIL,
    password: process.env.NEXT_PUBLIC_DEMO_PASSWORD,
  };
  console.log(data);
  try {
    await ky.post("/v1/auth/login", {
      json: data,
    });
  } catch (error) {
    const message = await getGlobalError(error);
    throw new Error(message);
  }
}

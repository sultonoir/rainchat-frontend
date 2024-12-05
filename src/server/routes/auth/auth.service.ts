import ky from "ky";
import { SigninSchema } from "./auth.input";
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

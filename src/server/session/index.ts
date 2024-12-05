"use server";
import { Session } from "@/types";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const getSession = async () => {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth");
  if (!auth?.value) {
    return null;
  }
  const decoded = jwtDecode(auth.value) as Session;

  return decoded;
};

"use server";
import { getServerUrl } from "@/lib/utils";
import ky from "ky";

type Deno = {
  name: string;
  id: string;
  description: string;
};

export async function getDino() {
  const data = await ky.get(getServerUrl + "/dino").json<Deno[]>();
  return data;
}

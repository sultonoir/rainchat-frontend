/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerurl } from "@/lib/utils";
import { ChatWithMember } from "@/types";
import ky from "ky";
import { cookies } from "next/headers";

export async function getChatById(id: string) {
  const cockieStore = await cookies();
  try {
    return await ky
      .get(getServerurl + `/chat/${id}`, {
        headers: {
          Cookie: cockieStore.toString(),
        },
      })
      .json<ChatWithMember>();
  } catch (error) {
    return undefined;
  }
}

export async function getInviteCode(id: string) {
  const cockieStore = await cookies();
  try {
    return await ky
      .get(getServerurl + `/member/code/${id}`, {
        headers: {
          Cookie: cockieStore.toString(),
        },
      })
      .json<ChatWithMember>();
  } catch (error) {
    return undefined;
  }
}

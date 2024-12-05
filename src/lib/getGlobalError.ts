import { GlobalMessageError } from "@/types";
import { HTTPError } from "ky";

export const getGlobalError = async (error: unknown) => {
  let message: string;

  if (error instanceof HTTPError) {
    const errorJson = await error.response.json<GlobalMessageError>();
    message = errorJson.message;
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    message = "Shomething went wrong";
  }

  return message;
};

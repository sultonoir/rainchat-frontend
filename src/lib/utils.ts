import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function serverUrl() {
  return process.env.NODE_ENV === "production"
    ? (process.env.SERVER_URL as string)
    : "http://localhost:8000";
}

export const getServerUrl = serverUrl();

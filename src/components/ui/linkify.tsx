import { cn } from "@/lib/utils";
import Linkify from "linkify-react";

interface LinkifyProps {
  message: string;
}

export function LinkifyUrl({ message }: LinkifyProps) {
  const options = {
    formatHref: (href: string) => href.replace(/^https?:/, ""),
  };

  // Regex yang lebih ketat untuk mencocokkan URL valid
  const regexToMatch =
    /^(https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?::\d+)?(?:[\/\w .-]*)*$/g;

  // Cek apakah message cocok dengan regex
  const isMatch = regexToMatch.test(message);

  return (
    <Linkify options={options}>
      <p
        className={cn("", {
          "text-primary hover:underline": isMatch, // Berikan kelas 'text-primary' hanya jika cocok dengan URL
        })}
      >
        {message}
      </p>
    </Linkify>
  );
}

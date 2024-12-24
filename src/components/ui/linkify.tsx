import { cn } from "@/lib/utils";
import Linkify from "linkify-react";

interface LinkifyProps extends React.HTMLAttributes<HTMLElement> {
  message: string;
}

export function LinkifyUrl({ message, className }: LinkifyProps) {
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
        className={cn("", className, {
          "text-start text-primary hover:underline": isMatch,
        })}
      >
        {message}
      </p>
    </Linkify>
  );
}

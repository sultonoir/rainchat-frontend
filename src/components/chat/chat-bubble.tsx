import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import MessageLoading from "./message-loading";
import { Button, ButtonProps } from "../ui/button";
import { Media } from "@/types";
import Image from "next/image";
import { CustomImage } from "../ui/custom-image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ChatBubble
const chatBubbleVariant = cva("flex gap-2 max-w-xs items-end relative group", {
  variants: {
    variant: {
      received: "self-start text-start",
      sent: "self-end flex-row-reverse text-end",
    },
    layout: {
      default: "",
      ai: "max-w-full w-full items-center",
    },
  },
  defaultVariants: {
    variant: "received",
    layout: "default",
  },
});

interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariant> {}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant, layout, children, ...props }, ref) => (
    <div
      className={cn(
        chatBubbleVariant({ variant, layout, className }),
        "group relative",
      )}
      ref={ref}
      {...props}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) && typeof child.type !== "string"
          ? React.cloneElement(child, {
              variant,
              layout,
            } as React.ComponentProps<typeof child.type>)
          : child,
      )}
    </div>
  ),
);
ChatBubble.displayName = "ChatBubble";

// ChatBubbleAvatar
interface ChatBubbleAvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
}

const ChatBubbleAvatar: React.FC<ChatBubbleAvatarProps> = ({
  src = "/avatar.png",
  fallback,
  className,
}) => <CustomImage src={src} name={fallback} className={className} />;

// ChatBubbleMessage
const chatBubbleMessageVariants = cva("p-4", {
  variants: {
    variant: {
      received:
        "bg-secondary text-secondary-foreground rounded-r-lg rounded-tl-lg",
      sent: "bg-accent/40 text-primary-foreground rounded-l-lg rounded-tr-lg",
    },
    layout: {
      default: "",
      ai: "border-t w-full rounded-none bg-transparent",
    },
  },
  defaultVariants: {
    variant: "received",
    layout: "default",
  },
});

interface ChatBubbleMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleMessageVariants> {
  isLoading?: boolean;
}

const ChatBubbleMessage = React.forwardRef<
  HTMLDivElement,
  ChatBubbleMessageProps
>(
  (
    { className, variant, layout, isLoading = false, children, ...props },
    ref,
  ) => (
    <div
      className={cn(
        chatBubbleMessageVariants({ variant, layout, className }),
        "max-w-full whitespace-pre-wrap break-words text-primary-foreground",
      )}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <MessageLoading />
        </div>
      ) : (
        children
      )}
    </div>
  ),
);
ChatBubbleMessage.displayName = "ChatBubbleMessage";

// ChatBubbleTimestamp
interface ChatBubbleTimestampProps
  extends React.HTMLAttributes<HTMLDivElement> {
  timestamp: string;
}

const ChatBubbleTimestamp: React.FC<ChatBubbleTimestampProps> = ({
  timestamp,
  className,
  ...props
}) => (
  <div
    className={cn("mt-2 text-right text-xs text-muted-foreground", className)}
    {...props}
  >
    {timestamp}
  </div>
);

interface ChatBubbleGaleryProps extends React.HTMLAttributes<HTMLDivElement> {
  media: Media[];
}

const ChatBubbleGalery: React.FC<ChatBubbleGaleryProps> = ({
  className,
  media,
}) => {
  return (
    <>
      {media.length <= 1 ? (
        <Image
          src={media.at(0)?.value ?? "/avatar.png"}
          alt="image"
          width={200}
          height={200}
          className="size-full rounded-lg object-cover"
        />
      ) : (
        <div className="grid size-64 grid-cols-2 gap-1 rounded-2xl">
          {media.map((m) => (
            <div
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg",
                className,
              )}
              key={m.id}
            >
              <Image
                fill
                src={m.value}
                sizes="100%"
                alt="image"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

// ChatBubbleAction
type ChatBubbleActionProps = ButtonProps & {
  icon: React.ReactNode;
};

const ChatBubbleAction: React.FC<ChatBubbleActionProps> = ({
  icon,
  onClick,
  className,
  variant = "ghost",
  size = "icon",
  title,
  ...props
}) => (
  <Tooltip delayDuration={0}>
    <TooltipTrigger asChild>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={onClick}
        {...props}
      >
        {icon}
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{title}</p>
    </TooltipContent>
  </Tooltip>
);

interface ChatBubbleActionWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received";
  className?: string;
}

const ChatBubbleActionWrapper = React.forwardRef<
  HTMLDivElement,
  ChatBubbleActionWrapperProps
>(({ variant, className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute top-1/2 flex -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
      variant === "sent"
        ? "-left-1 -translate-x-full flex-row-reverse"
        : "-right-1 translate-x-full",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
ChatBubbleActionWrapper.displayName = "ChatBubbleActionWrapper";

export {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  chatBubbleVariant,
  chatBubbleMessageVariants,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleGalery,
};

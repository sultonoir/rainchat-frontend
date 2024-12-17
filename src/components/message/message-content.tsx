import { useSession } from "@/provider/session-provider";
import { Messages } from "@/types";
import {
  ChatBubble,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleGalery,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "../chat/chat-bubble";
import { fromNow } from "@/lib/from-now";
import { RemoveMessage } from "./message-remove";
import { ReplyMessage } from "./message-reply";
import { MessageReplyContent } from "./message-reply-content";

export const MessageContent = ({ message }: { message: Messages }) => {
  const { user } = useSession();

  const isMe = user?.id === message.senderId;

  return (
    <ChatBubble variant={isMe ? "sent" : "received"}>
      <ChatBubbleAvatar src={message.sender.image} />
      <ChatBubbleMessage className="space-y-2">
        <p className="text-sm text-white">{message.sender.name}</p>
        {message.replyTo && (
          <MessageReplyContent
            message={message.replyTo.content}
            name={message.replyTo.sender.name}
            media={message.replyTo.media}
          />
        )}
        {!!message.media.length && <ChatBubbleGalery media={message.media} />}
        {message.content}
        {message.createdAt && (
          <ChatBubbleTimestamp
            timestamp={fromNow(new Date(message.createdAt))}
          />
        )}
      </ChatBubbleMessage>
      <ChatBubbleActionWrapper>
        {isMe && <RemoveMessage message={message} />}
        <ReplyMessage message={message} />
      </ChatBubbleActionWrapper>
    </ChatBubble>
  );
};

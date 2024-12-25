import React from "react";
import useMessage from "@/hooks/use-message";
import { MessageReplyContent } from "../message/message-reply-content";
import { FormSendMessage } from "../form/send-message/form-send-message";

interface Props {
  id: string;
  close: () => void;
}

export const ChatFooter = ({ id, close }: Props) => {
  const { message } = useMessage();
  return (
    <div className="flex w-full flex-none flex-shrink-0 flex-col gap-2 border-t p-3">
      {message && message.chatId === id && (
        <MessageReplyContent
          message={message.content}
          name={message.sender.name}
          media={message.media}
          isClosed={true}
        />
      )}
      <FormSendMessage close={close} id={id} />
    </div>
  );
};

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { useServer } from "../../store/useServer";
import { getMessages } from "../../api";
import Message from "./Message";
import { useAuth } from "../../store/useAuth";
import { ScrollArea, Stack } from "@mantine/core";
import { Message as IMessage } from "../../types";

function Messages() {
  const { server, setMessages, messages, currentChannel } = useServer(
    (state) => state
  );
  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    viewport.current?.scrollTo({
      top: viewport.current?.scrollHeight,
      behavior: "smooth",
    });
  const user = useAuth((state) => state.user);

  const { isLoading } = useQuery({
    queryKey: ["messages", server?.id, currentChannel?.id],
    queryFn: () =>
      getMessages({
        serverId: server?.id!,
        channelId: currentChannel?.id!,
      }),
    onSuccess: (data) => {
      setMessages((messages) => data.messages);
      scrollToBottom();
    },
  });

  useEffect(() => {
    scrollToBottom();

    return () => {};
  }, [messages]);

  return (
    <>
      <ScrollArea sx={{ height: "100%" }} viewportRef={viewport}>
        {isLoading && "Loading...."}
        {messages &&
          messages.map((message: IMessage, i: number) => {
            if (message.userId === messages[i - 1]?.userId) {
              return (
                <Message
                  key={message.id}
                  messageObject={message}
                  isSent={message.userId == user?.id}
                  isSameUser={true}
                />
              );
            }
            return (
              <Message
                key={message.id}
                messageObject={message}
                isSent={message.userId == user?.id}
              />
            );
          })}
      </ScrollArea>
    </>
  );
}

export default Messages;

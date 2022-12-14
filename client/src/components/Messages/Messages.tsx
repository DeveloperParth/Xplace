import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useServer } from "../../store/useServer";
import { getMessages } from "../../api";
import Message from "./Message";
import { useAuth } from "../../store/useAuth";
import { ScrollArea, Stack } from "@mantine/core";
import { Message as IMessage } from "../../types";

function Messages() {
  const { server, setMessages } = useServer((state) => state);
  const user = useAuth((state) => state.user);

  const { data, isLoading } = useQuery({
    queryKey: ["messages", server?.id],
    queryFn: () => getMessages(server!.id),
    onSuccess: (data) => {
      setMessages((messages) => [...messages, ...data.messages]);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  return (
    <ScrollArea sx={{ height: "100%" }}>
      {data?.messages.map((message: IMessage, i: number) => {
        if (message.userId === data.messages[i - 1]?.userId) {
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
  );
}

export default Messages;

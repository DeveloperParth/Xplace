import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useServer } from "../../store/useServer";
import { getMessages } from "../../api";
import Message from "./Message";
import { useAuth } from "../../store/useAuth";

function Messages() {
  const server = useServer((state) => state.server);
  const user = useAuth((state) => state.user);

  const { data, isLoading, error } = useQuery({
    queryKey: ["messages", server?.id],
    queryFn: () => getMessages(server!.id),
  });

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="flex flex-col gap-4">
      {data?.messages.map((message: any) => {
        return (
          <Message
            key={message.id}
            message={message.text}
            isSent={message.userId == user?.id}
            user={message.user}
            createdAt={message.createdAt}
          />
        );
      })}
    </div>
  );
}

export default Messages;

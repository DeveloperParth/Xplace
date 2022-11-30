import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { createMessage } from "../../api";
import { useServer } from "../../store/useServer";

function CreateMessage() {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const server = useServer((state) => state.server);
  const mutation = useMutation({
    mutationFn: () => createMessage(server!.id, message),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });
  const createMessageHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
    setMessage("");
  };
  return (
    <form onSubmit={createMessageHandler} className="flex">
      <input
        type="text"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        className="w-[80%] border-b dark:border-white/50 h-8"
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default CreateMessage;

import { useQuery } from "@tanstack/react-query";
import React from "react";
import Messages from "../components/Messages/Messages";
import { useServer } from "../store/useServer";
import { getMessages } from "../api";
import CreateMessage from "../components/Messages/CreateMessage";
function HomePage() {
  const server = useServer((state) => state.server);

  return (
    <>
      <div className="w-full border-b dark:border-white/50 h-12">
        {server?.name}
      </div>

      {server?.id && (
        <>
          <Messages />
          <CreateMessage />
        </>
      )}
    </>
  );
}

export default HomePage;

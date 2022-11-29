import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { createServer, getServers } from "../api";
import { useServer } from "../store/useServer";

function Sidebar() {
  const [name, setName] = React.useState("");
  const queryClient = useQueryClient();
  const setServer = useServer((state) => state.setServer);
  const { data, isLoading } = useQuery({
    queryKey: ["servers"],
    queryFn: getServers,
  });
  const mutation = useMutation({
    mutationFn: createServer,
    onSuccess: () => {
      queryClient.invalidateQueries(["servers"]);
    },
  });
  const createServerHandler = async () => {
    mutation.mutate(name);
  };
  return (
    <div className="h-screen border-r px-3">
      <div className="border-b">
        <h1>Sidebar</h1>
      </div>
      <input type="text" onChange={(e) => setName(e.target.value)} />
      <button onClick={createServerHandler}>New</button>
      {!isLoading &&
        data?.servers.map((server: any) => (
          <div
            key={server.id}
            className="flex items-center justify-between border py-2 px-3"
            onClick={() => {
              setServer(server);
            }}
          >
            {server.name}-{server.owner?.name}
          </div>
        ))}
    </div>
  );
}

export default Sidebar;

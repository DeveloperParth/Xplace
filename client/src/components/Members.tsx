import { Navbar, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getMembers } from "../api";
import { useServer } from "../store/useServer";

function Members() {
  const server = useServer((state) => state.server);
  const { data, isLoading } = useQuery({
    queryKey: ["members", server?.id],
    queryFn: () => getMembers(server!.id),
  });
  const members = data?.members?.map((member) => (
    <div className="flex items-center">
      <img
        src="https://i.pravatar.cc/300"
        className="w-10 h-10 rounded-full"
        alt="avatar"
      />
      <div className="ml-3">
        <p className="text-base font-medium text-gray-900">{member.username}</p>
        <p className="text-sm font-medium text-gray-500">{member.email}</p>
      </div>
    </div>
  ));
  return (
    <Navbar width={{ sm: "100px" }}>
      <Stack>{members}</Stack>
    </Navbar>
  );
}

export default Members;

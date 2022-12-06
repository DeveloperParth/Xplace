import { Navbar, Stack, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getMembers } from "../api";
import { useServer } from "../store/useServer";
import { User } from "../types";

function Members() {
  const server = useServer((state) => state.server);
  const { data, isLoading } = useQuery({
    queryKey: ["members", server?.id],
    queryFn: () => getMembers(server!.id),
  });
  const members = data?.members?.map((member: User) => (
    <div className="flex items-center" key={member.id}>
      <img
        src="https://i.pravatar.cc/300"
        className="w-10 h-10 rounded-full"
        alt="avatar"
      />
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-500">{member.name}</p>
      </div>
    </div>
  ));
  return (
    <Navbar width={{ sm: "100px", md: "200px", lg: "250px" }} px="lg">
      <Title
        order={3}
        sx={(theme) => ({
          padding: theme.spacing.md,
          paddingTop: 18,
          marginBottom: theme.spacing.md,
        })}
      >
        Members
      </Title>
      <Stack>{members}</Stack>
    </Navbar>
  );
}

export default Members;

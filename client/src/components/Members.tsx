import {
  Avatar,
  Group,
  Navbar,
  Stack,
  Title,
  Text,
  Indicator,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getMembers } from "../api";
import { useServer } from "../store/useServer";
import { User } from "../types";

const STATUS = {
  Online: "green",
  Idle: "yellow",
  DND: "red",
  Offline: "gray",
};

function Members() {
  const { server, onlineUsers } = useServer((state) => state);
  const { data, isLoading } = useQuery({
    queryKey: ["members", server?.id],
    queryFn: () => getMembers(server!.id),
  });
  const members = data?.members?.map((member: User) => (
    <Group key={member.id} style={{ cursor: "pointer" }}>
      <Indicator
        dot
        inline
        size={16}
        offset={7}
        position="bottom-end"
        color={STATUS[member.status]}
        withBorder
      >
        {" "}
        <Avatar
          src="https://i.pravatar.cc/300"
          alt="avatar"
          size="lg"
          radius="xl"
        />
      </Indicator>
      <div className="ml-3">
        <Text sx={{ color: member.Roles?.at(0)?.color }}>{member.name}</Text>
      </div>
    </Group>
  ));
  return (
    <Navbar
      left="unset"
      width={{ sm: "100px", md: "200px", lg: "250px" }}
      px="lg"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.colors.gray[1],
      })}
    >
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

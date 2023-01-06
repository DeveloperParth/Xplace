import {
  Avatar,
  Group,
  Navbar,
  Stack,
  Title,
  Text,
  Indicator,
  Skeleton,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getMembers } from "../api";
import { useServer } from "../store/useServer";
import { ServerMember } from "../types";

const STATUS = {
  Online: "green",
  Idle: "yellow",
  DND: "red",
  Offline: "gray",
};

function Members() {
  const { server } = useServer((state) => state);
  const { data, isLoading } = useQuery({
    queryKey: ["members", server?.id],
    queryFn: () => getMembers(server!.id),
  });
  const members = data?.members?.map((member: ServerMember) => (
    <Group
      key={member.userId + member.serverId}
      style={{ cursor: "pointer" }}
      id={`user-${member.userId}`}
    >
      <Indicator
        dot
        inline
        size={16}
        offset={7}
        position="bottom-end"
        color={STATUS[member.User.status]}
        withBorder
      >
        <Avatar
          src="https://i.pravatar.cc/300"
          alt="avatar"
          size="lg"
          radius="xl"
        />
      </Indicator>
      <div className="ml-3">
        <Text sx={{ color: member.Role?.color }}>{member.User.name}</Text>
      </div>
    </Group>
  ));
  return (
    <Navbar
      left="unset"
      width={{ xs: 0, sm: "100px", md: "200px", lg: "250px" }}
      px="lg"
      hiddenBreakpoint="xs"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.discord[1]
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
      {isLoading && <PlaceHolder />}
      <Stack>{members}</Stack>
    </Navbar>
  );
}
const PlaceHolder = () => {
  const Single = () => (
    <Group noWrap align="center" mb="md">
      <Skeleton height={50} circle />
      <Stack w="60%" spacing="xs" justify="center">
        <Skeleton width="100%" height={5} />
        <Skeleton width="100%" height={5} />
      </Stack>
    </Group>
  );
  return (
    <>
      <Single />
      <Single />
      <Single />
      <Single />
      <Single />
      <Single />
      <Single />
      <Single />
      <Single />
    </>
  );
};
export default Members;

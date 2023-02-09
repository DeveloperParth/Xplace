import React from "react";
import { ServerMember } from "../../types";
import { Avatar, Group, Indicator, Text } from "@mantine/core";
import { useContextMenu } from "../../store/useContextMenu";

interface PropTypes {
  member: ServerMember;
}
const STATUS = {
  Online: "green",
  Idle: "yellow",
  DND: "red",
  Offline: "gray",
};
function Member({ member }: PropTypes) {
  const handleContextMenu = useContextMenu((state) => state.handleContextMenu);

  return (
    <Group
      key={member.userId + member.serverId}
      style={{ cursor: "pointer" }}
      id={`user-${member.userId}`}
      onContextMenu={(e) =>
        handleContextMenu({ e, type: "USER", content: member.userId })
      }
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
        <Text sx={{ color: member.Roles?.at(0)?.color }}>
          {member.User.name}
        </Text>
      </div>
    </Group>
  );
}

export default Member;

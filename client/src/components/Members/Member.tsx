import React, { forwardRef } from "react";
import { ServerMember } from "../../types";
import { Avatar, Group, Indicator, Text } from "@mantine/core";
import { useContextMenu } from "../../store/useContextMenu";
import ProfileCard from "./ProfileCard";
import { useUi } from "../../store/useUi";

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

  const [isProfileCardOpen, setIsProfileCardOpen] = React.useState(false);
  const profileCard = useUi((state) => state.profileCard);
  const setProfileCard = useUi((state) => state.setProfileCard);

  return (
    <div style={{ position: "relative" }}>
      <Group
        key={member.userId + member.serverId}
        style={{ cursor: "pointer", position: "relative" }}
        id={`user-${member.userId}`}
        onContextMenu={(e) =>
          handleContextMenu({ e, type: "USER", content: member.userId })
        }
        onClick={() => setProfileCard(member.id)}
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
      {profileCard === member.id && <ProfileCard member={member} />}
    </div>
  );
}
export default Member;

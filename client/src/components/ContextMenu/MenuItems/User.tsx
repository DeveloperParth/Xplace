import React from "react";
import { Menu } from "@mantine/core";
import { useServer } from "../../../store/useServer";
import { PermissionTypes } from "../../../types";
import { IconHammer } from "@tabler/icons";
import { IconTrash } from "@tabler/icons";
function User() {
  const hasPermission = useServer((state) => state.hasPermission);
  return (
    <>
      <Menu.Item>View Profile</Menu.Item>
      <Menu.Item>Send Message</Menu.Item>
      {hasPermission(PermissionTypes.kickPeople) && (
        <Menu.Item color="red" icon={<IconTrash />}>
          Kick
        </Menu.Item>
      )}
      {hasPermission(PermissionTypes.banPeople) && (
        <Menu.Item color="red" icon={<IconHammer />}>
          Ban
        </Menu.Item>
      )}
    </>
  );
}

export default User;

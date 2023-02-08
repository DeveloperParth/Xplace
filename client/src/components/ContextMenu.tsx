// custom contect menu component for the app from scratch

import { createStyles } from "@mantine/core";
import { Menu } from "@mantine/core";
import { IconEdit } from "@tabler/icons";
import { IconTrash } from "@tabler/icons";
import { IconArrowBackUp } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import { useMessage } from "../store/useMessage";
import { useServer } from "../store/useServer";
import { PermissionTypes } from "../types";
import { IconHammer } from "@tabler/icons";
import { useContextMenu } from "../store/useContextMenu";

const ContextMenuWidth = 200;

const ContextMenuDemo = () => {
  const { classes } = useStyles();
  const setReplyingTo = useMessage((state) => state.setReplyingTo);
  const setEditing = useMessage((state) => state.setEditing);
  const messages = useServer((state) => state.messages);
  const hasPermission = useServer((state) => state.hasPermission);
  const user = useAuth((state) => state.user);
  const { show, x, y, type, setContextMenu, content } = useContextMenu(
    (state) => state
  );
  useEffect(() => {
    document.addEventListener("contextmenu", contextMenuHandler);
    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("contextmenu", contextMenuHandler);
      document.removeEventListener("click", clickHandler);
    };
  }, []);
  const clickHandler = (e: any) => {
    setContextMenu({ x: 0, y: 0, show: false, type: null });
  };
  const contextMenuHandler = (e: any) => {
    e.preventDefault();
    setContextMenu({
      x:
        e.clientX > document.body.clientWidth - ContextMenuWidth
          ? e.clientX - ContextMenuWidth
          : e.clientX,
      y: e.clientY,
      show: true,
    });
  };
  const MenuItems = () => {
    switch (type) {
      case "MESSAGE":
        const message = messages.find((message) => message.id === content);
        console.log({ content });

        return (
          <>
            <Menu.Item
              rightSection={<IconArrowBackUp />}
              onClick={() => {
                message && setReplyingTo(message);
              }}
            >
              Reply
            </Menu.Item>
            {(message?.user.id === user?.id ||
              hasPermission(PermissionTypes.manageMessages)) && (
              <>
                <Menu.Item
                  rightSection={<IconEdit />}
                  onClick={() => {
                    message && setEditing(message);
                  }}
                >
                  Edit
                </Menu.Item>
                <Menu.Item color="red" rightSection={<IconTrash />}>
                  Delete
                </Menu.Item>
              </>
            )}
          </>
        );
      case "USER":
        return (
          <>
            <Menu.Item>View Profile</Menu.Item>
            <Menu.Item>Send Message</Menu.Item>
            {hasPermission(PermissionTypes.kickPeople) && (
              <Menu.Item color="red" icon={<IconTrash />}>
                Kick{" "}
              </Menu.Item>
            )}
            {hasPermission(PermissionTypes.banPeople) && (
              <Menu.Item color="red" icon={<IconHammer />}>
                Ban
              </Menu.Item>
            )}
          </>
        );
      case "SERVER":
        return (
          <>
            <Menu.Item>View Server</Menu.Item>
            <Menu.Item>Invite People</Menu.Item>
          </>
        );

      default:
        return null;
    }
  };
  if (show) {
    return (
      <div
        className={classes.contextMenu}
        style={{
          top: y,
          left: x,
        }}
      >
        <Menu opened={true} width={ContextMenuWidth}>
          <Menu.Dropdown color="dark" className={classes.menu}>
            <MenuItems />
          </Menu.Dropdown>
        </Menu>
      </div>
    );
  } else {
    return null;
  }
};
const useStyles = createStyles((theme) => ({
  contextMenu: {
    zIndex: 1003,
    position: "absolute",
  },
  menu: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },
}));
export default ContextMenuDemo;

// custom contect menu component for the app from scratch

import { createStyles } from "@mantine/core";
import { Menu } from "@mantine/core";
import { IconEdit } from "@tabler/icons";
import { IconTrash } from "@tabler/icons";
import { IconArrowBackUp } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { useMessage } from "../store/useMessage";
import { useServer } from "../store/useServer";

const ContextMenuDemo = () => {
  const { classes } = useStyles();
  const setReplyingTo = useMessage((state) => state.setReplyingTo);
  const messages = useServer((state) => state.messages);
  const [contextMenu, setContextMenu] = useState({
    x: 0,
    y: 0,
    show: false,
    content: "",
  });
  useEffect(() => {
    document.addEventListener("contextmenu", contextMenuHandler);
    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("contextmenu", contextMenuHandler);
      document.removeEventListener("click", clickHandler);
    };
  }, []);
  const clickHandler = (e: any) => {
    setContextMenu({ x: 0, y: 0, show: false, content: "" });
  };
  const contextMenuHandler = (e: any) => {
    e.preventDefault();

    e.path.some((el: HTMLElement) => {
      if (el.id && el.id.startsWith("message-")) {
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
          show: true,
          content: el.id,
        });
        return true;
      }
      setContextMenu({ x: 0, y: 0, show: false, content: "" });
      return false;
    });
  };
  if (contextMenu.show) {
    return (
      <div
        className={classes.contextMenu}
        style={{
          top: contextMenu.y,
          left: contextMenu.x,
        }}
      >
        <Menu opened={true} width={170}>
          <Menu.Dropdown color="dark" className={classes.menu}>
            <Menu.Item
              rightSection={<IconArrowBackUp />}
              onClick={() => {
                const message = messages.find(
                  (message) =>
                    message.id === contextMenu.content.split("message-")[1]
                );
                message && setReplyingTo(message);
                console.log(messages);
              }}
            >
              Reply
            </Menu.Item>
            <Menu.Item rightSection={<IconEdit />}>Edit</Menu.Item>
            <Menu.Item color="red" rightSection={<IconTrash />}>
              Delete
            </Menu.Item>
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

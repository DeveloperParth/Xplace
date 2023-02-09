// custom contect menu component for the app from scratch

import { createStyles } from "@mantine/core";
import { Menu } from "@mantine/core";
import { IconEdit } from "@tabler/icons";
import { IconTrash } from "@tabler/icons";
import { IconArrowBackUp } from "@tabler/icons";
import { Suspense, lazy, useEffect, useState } from "react";
import { useAuth } from "../../store/useAuth";
import { useMessage } from "../../store/useMessage";
import { useServer } from "../../store/useServer";
import { PermissionTypes } from "../../types";
import { IconHammer } from "@tabler/icons";
import { useContextMenu } from "../../store/useContextMenu";

// lazy load the menu items
const User = lazy(() => import("./MenuItems/User"));
const Server = lazy(() => import("./MenuItems/Server"));
const Channel = lazy(() => import("./MenuItems/Channel"));
const Message = lazy(() => import("./MenuItems/Message"));

export const ContextMenuWidth = 200;

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
    setContextMenu({ x: 0, y: 0, type: null, content: "" });
  };
  const contextMenuHandler = (e: any) => {
    e.preventDefault();
    console.log({ show });
    if (show) {
      setContextMenu({ x: 0, y: 0, show: false, type: null, content: "" });
    }
  };
  const MenuItems = () => {
    switch (type) {
      case "MESSAGE":
        return <Message />;
      case "USER":
        return <User />;
      case "SERVER":
        return <User />;
      case "CHANNEL":
        return <Channel />;
      default:
        // setContextMenu({ x: 0, y: 0, show: false, type: null });
        return null;
    }
  };
  if (show && type) {
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
            <Suspense fallback={<></>}>
              <MenuItems />
            </Suspense>
          </Menu.Dropdown>
        </Menu>
      </div>
    );
  } else {
    return <></>;
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

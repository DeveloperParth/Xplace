import { Menu } from "@mantine/core";
import React from "react";
import { useAuth } from "../../../store/useAuth";
import { useMessage } from "../../../store/useMessage";
import { useServer } from "../../../store/useServer";
import { useContextMenu } from "../../../store/useContextMenu";
import { IconArrowBackUp } from "@tabler/icons";
import { PermissionTypes } from "../../../types";
import { IconEdit } from "@tabler/icons";
import { IconTrash } from "@tabler/icons";
import { deleteMessage } from "../../../api";

function Message() {
  const setReplyingTo = useMessage((state) => state.setReplyingTo);
  const setEditing = useMessage((state) => state.setEditing);
  const messages = useServer((state) => state.messages);
  const hasPermission = useServer((state) => state.hasPermission);
  const content = useContextMenu((state) => state.content);
  const setContextMenu = useContextMenu((state) => state.setContextMenu);
  const user = useAuth((state) => state.user);
  const message = messages.find((message) => message.id === content);
  if (!message) {
    setContextMenu({ x: 0, y: 0, type: null, content: "" });
    return null;
  }
  const deleteMessageHandler = async () => {
    await deleteMessage(message?.id);
  };

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
          <Menu.Item
            color="red"
            rightSection={<IconTrash />}
            onClick={deleteMessageHandler}
          >
            Delete
          </Menu.Item>
        </>
      )}
    </>
  );
}

export default Message;

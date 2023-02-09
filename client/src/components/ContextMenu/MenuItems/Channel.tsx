import { Menu, Text } from "@mantine/core";
import React from "react";
import { useServer } from "../../../store/useServer";
import { PermissionTypes } from "../../../types";
import { deleteChannel } from "../../../api";
import { useContextMenu } from "../../../store/useContextMenu";
import { openConfirmModal } from "@mantine/modals";

function Channel() {
  const hasPermission = useServer((state) => state.hasPermission);
  const content = useContextMenu((state) => state.content);
  const server = useServer((state) => state.server);
  const channel = server?.Channels?.find((channel) => channel.id === content);
  console.log(server);
  if (!channel) return null;
  const deleteChannelHandler = async () => {
    if (!channel) return;
    await deleteChannel(channel.id);
  };
  const openModal = () =>
    openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          Are you sure you want to delete <b>{channel.name}?</b>This is a
          irreversible action.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: deleteChannelHandler,
    });

  return (
    <>
      <Menu.Item>Mark As Read</Menu.Item>
      <Menu.Item>Mute Channel</Menu.Item>
      {hasPermission(PermissionTypes.manageChannels) && (
        <>
          <Menu.Divider />
          <Menu.Item>Edit Channel</Menu.Item>
          <Menu.Item color="red" onClick={openModal}>
            Delete Channel
          </Menu.Item>
        </>
      )}
    </>
  );
}

export default Channel;

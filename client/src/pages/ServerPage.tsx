import {
  ActionIcon,
  Avatar,
  Button,
  createStyles,
  Group,
  Tabs,
  TextInput,
  Title,
} from "@mantine/core";
import { IconFile } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { getServer } from "../api";
import { Server } from "../types";

function ServerPage() {
  const { id } = useParams();
  const { classes } = useStyles();
  const { data } = useQuery<{ server: Server }>({
    queryKey: ["server", id],
    queryFn: () => getServer(id!),
  });

  return (
    <>
      <Tabs orientation="vertical" variant="pills" defaultValue="general">
        <Tabs.List p={10} className={classes.list}>
          <Title order={5}>{data?.server.name}'s settings</Title>
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="channels">Channels</Tabs.Tab>
          <Tabs.Tab value="roles">Roles</Tabs.Tab>
          <Tabs.Tab value="members">Members</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel className={classes.panel} value="general">
          <Group>
            <Avatar
              src={import.meta.env.VITE_UPLOADS_URL + data?.server.photo}
              size="xl"
            />
            <TextInput label="Server name" defaultValue={data?.server.name} />
          </Group>
        </Tabs.Panel>
        <Tabs.Panel className={classes.panel} value="channels">
          Channels
        </Tabs.Panel>
        <Tabs.Panel className={classes.panel} value="roles">
          Roles
        </Tabs.Panel>
        <Tabs.Panel className={classes.panel} value="members">
          Members
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  list: {
    width: 200,
    height: "100vh",
  },
  panel: {
    width: "100%",
    padding: theme.spacing.xl,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },
}));

export default ServerPage;

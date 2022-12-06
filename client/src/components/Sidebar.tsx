import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { createServer, getServers } from "../api";
import { useAuth } from "../store/useAuth";
import { useServer } from "../store/useServer";
import { Server } from "../types";
import {
  createStyles,
  Navbar,
  UnstyledButton,
  Tooltip,
  Title,
  Modal,
  TextInput,
  Button,
} from "@mantine/core";
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
} from "@tabler/icons";
import { IconPlus } from "@tabler/icons";

const mainLinksMockdata = [
  { icon: IconHome2, label: "Home" },
  { icon: IconGauge, label: "Dashboard" },
  { icon: IconDeviceDesktopAnalytics, label: "Analytics" },
  { icon: IconCalendarStats, label: "Releases" },
  { icon: IconUser, label: "Account" },
  { icon: IconFingerprint, label: "Security" },
  { icon: IconSettings, label: "Settings" },
];

function Sidebar() {
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [serverName, setServerName] = useState("");
  const { classes, cx } = useStyles();
  const queryClient = useQueryClient();
  const setServer = useServer((state) => state.setServer);
  const server = useServer((state) => state.server);
  const { data, isLoading } = useQuery({
    queryKey: ["servers"],
    queryFn: getServers,
    onSuccess(data) {
      setServer(data.servers[0]);
      setActiveLink(data.servers[0].id);
    },
  });
  const createServerMutation = useMutation({
    mutationFn: createServer,
    onSuccess: () => {
      queryClient.invalidateQueries(["servers"]);
    },
  });
  const handleServerChange = async (server: Server) => {
    setServer(server);
    await queryClient.invalidateQueries(["messages"]);
  };
  const [active, setActive] = useState("Releases");
  const [activeLink, setActiveLink] = useState("Settings");

  const mainLinks = mainLinksMockdata.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionDuration={0}
      key={link.label}
    >
      <UnstyledButton
        onClick={() => setActive(link.label)}
        className={cx(classes.mainLink, {
          [classes.mainLinkActive]: link.label === active,
        })}
      >
        <link.icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ));

  const links =
    data &&
    data.servers.map((server: Server, i: number) => (
      <a
        className={cx(classes.link, {
          [classes.linkActive]: activeLink === server.id,
        })}
        href="/"
        onClick={(event) => {
          event.preventDefault();
          setActiveLink(server.id);
          handleServerChange(server);
        }}
        key={server.id}
      >
        {server.name}
      </a>
    ));
  return (
    <>
      <Navbar height={750} width={{ sm: 300 }}>
        <Navbar.Section grow className={classes.wrapper}>
          <div className={classes.aside}>
            <div className={classes.logo}>
              <IconHome2 type="mark" size={30} />
            </div>
            {mainLinks}
          </div>
          <div className={classes.main}>
            <Title order={4} className={classes.title}>
              {server?.name}
            </Title>

            <button
              className={classes.createServerButton}
              onClick={(event) => {
                event.preventDefault();
                setIsCreateServerOpen(true);
              }}
            >
              <IconPlus />
              <span>Create Server</span>
            </button>

            {links}
          </div>
        </Navbar.Section>
      </Navbar>
      <Modal
        title="Create server"
        opened={isCreateServerOpen}
        onClose={() => setIsCreateServerOpen(false)}
        withCloseButton
        zIndex={1000}
      >
        <TextInput
          label="Server Name"
          value={serverName}
          required
          onChange={(e) => setServerName(e.target.value)}
        />
        <Button
          mt="md"
          mx="auto"
          variant="outline"
          color="green"
          onClick={() => createServerMutation.mutate(serverName)}
        >
          Create
        </Button>
      </Modal>
    </>
  );
}
const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
  },
  createServerButton: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    borderRadius: theme.radius.xl,
    marginInline: "auto",
    marginBlock: theme.spacing.xs,
    fontWeight: 600,
    height: 44,
    width: 44,
    backgroundColor: theme.colors.green[5],
    color: theme.white,
    transition: "300ms ease-in",

    "&:hover": {
      width: "100%",
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      span: {
        opacity: 1,
      },
    },
    span: {
      display: "none",
      opacity: 0,
      transition: "200ms 100ms linear",
      // transitionDelay: "200ms",
    },
  },
  aside: {
    flex: "0 0 60px",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
  },

  main: {
    flex: 1,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },

  mainLink: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  mainLinkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },

  title: {
    boxSizing: "border-box",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: theme.spacing.xl,

    padding: theme.spacing.md,
    paddingTop: 18,
    // height: 60,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
  },

  logo: {
    boxSizing: "border-box",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    height: 60,
    paddingTop: theme.spacing.md,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    marginBottom: theme.spacing.xl,
  },

  link: {
    boxSizing: "border-box",
    display: "block",
    textDecoration: "none",
    borderTopRightRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    padding: `0 ${theme.spacing.md}px`,
    fontSize: theme.fontSizes.sm,
    marginRight: theme.spacing.md,
    fontWeight: 500,
    height: 44,
    lineHeight: "44px",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  linkActive: {
    "&, &:hover": {
      borderLeftColor: theme.fn.variant({
        variant: "filled",
        color: theme.primaryColor,
      }).background,
      backgroundColor: theme.fn.variant({
        variant: "filled",
        color: theme.primaryColor,
      }).background,
      color: theme.white,
    },
  },
}));

export default Sidebar;

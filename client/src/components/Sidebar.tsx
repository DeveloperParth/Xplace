import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createInvitation, createServer, getServers } from "../api";
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
  Avatar,
  Group,
  Select,
  Menu,
} from "@mantine/core";
import { IconHome2 } from "@tabler/icons";
import { IconPlus } from "@tabler/icons";
import { IconChevronDown } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { IconUserPlus } from "@tabler/icons";
import { IconSettings } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";

function Sidebar() {
  const navigate = useNavigate();
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [serverName, setServerName] = useState("");
  const { classes, cx } = useStyles();
  const queryClient = useQueryClient();
  const server = useServer((state) => state.server);
  const setServer = useServer((state) => state.setServer);
  const { status, setStatus } = useAuth((state) => state);
  const { data, isLoading } = useQuery({
    queryKey: ["servers"],
    queryFn: getServers,
    onSuccess(data) {
      if (data.servers.length === 0) return;
      if (!server?.id) {
        setServer(data.servers[0]);

        setActiveLink(data.servers[0].id);
      }
    },
  });
  const createServerMutation = useMutation({
    mutationFn: createServer,
    onSuccess: () => {
      queryClient.invalidateQueries(["servers"]);
    },
  });
  const handleServerChange = async (server: Server) => {
    await queryClient.invalidateQueries(["messages"]);
    navigate("/");
    setServer(server);
  };
  const [active, setActive] = useState("Releases");
  const [activeLink, setActiveLink] = useState("Settings");

  const mainLinks =
    data &&
    data.servers.map((server: Server) => (
      <Tooltip
        label={server.name}
        position="right"
        offset={10}
        withArrow
        bg="dark"
        transitionDuration={0}
        key={server.id}
      >
        <UnstyledButton
          onClick={() => {
            setActiveLink(server.id);
            handleServerChange(server);
          }}
          className={cx(classes.mainLink, {
            [classes.mainLinkActive]: active === server.id,
          })}
        >
          <Avatar
            size="lg"
            src={import.meta.env.VITE_UPLOADS_URL + server.photo}
          />
        </UnstyledButton>
      </Tooltip>
    ));

  const links =
    data &&
    [].map((server: Server, i: number) => (
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
  async function invitePeopleHandler(
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    try {
      const invitation = await createInvitation(server?.id!);
      showNotification({
        title: "Invitation link copied to clipboard",
        message: "Share it with your friends",
        color: "teal",
      });
      navigator.clipboard.writeText(invitation.link);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Navbar height={750} width={{ sm: 300 }}>
        <Navbar.Section grow className={classes.wrapper}>
          <div className={classes.aside}>
            <div className={classes.logo}>
              <IconHome2 type="mark" size={30} />
            </div>
            {mainLinks}
            <Tooltip
              label={"Create Server"}
              position="right"
              offset={10}
              withArrow
              bg="dark"
              transitionDuration={0}
            >
              <UnstyledButton
                onClick={() => setIsCreateServerOpen(true)}
                className={classes.createServerButton}
              >
                <IconPlus />
              </UnstyledButton>
            </Tooltip>
          </div>
          <div className={classes.main}>
            <Menu>
              <Menu.Target>
                <Group
                  position="center"
                  align="center"
                  noWrap
                  p="sm"
                  className={classes.titleContainer}
                >
                  <Title order={4} className={classes.title}>
                    {server?.name}
                  </Title>
                  <IconChevronDown />
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item
                  icon={<IconUserPlus size={18} />}
                  onClick={invitePeopleHandler}
                >
                  Invite people
                </Menu.Item>
                <Menu.Item
                  icon={<IconSettings size={18} />}
                  onClick={() => navigate(`/server/${server?.id}/settings`)}
                >
                  Server settings
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            {links}
            {/* dropdown  */}
            <Select
              label="Select status"
              data={[
                { label: "Normal", value: "" },
                { label: "Idle", value: "Idle" },
                { label: "Do not disturb", value: "DND" },
              ]}
              defaultValue={status || ""}
              onChange={(value) => setStatus(value as "Idle" | "DND")}
            />
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
        <form>
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
        </form>
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
    height: 50,
    width: 50,
    backgroundColor: theme.colors.green[5],
    color: theme.white,
    transition: "150ms ease-in",

    "&:hover": {
      borderRadius: theme.radius.lg,
    },
    span: {
      display: "none",
      opacity: 0,
      transition: "200ms 100ms linear",
      // transitionDelay: "200ms",
    },
  },
  aside: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "min(100%, 70px)",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[2],
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
        : theme.colors.gray[1],

    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      display: "none",
    },
  },

  mainLink: {
    borderRadius: theme.radius.xl,
    marginBottom: theme.spacing.sm,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    transition: "200ms ease-in",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      borderRadius: theme.radius.lg,
    },
  },

  mainLinkActive: {
    "&, &:hover": {
      borderRadius: theme.radius.lg,
    },
  },
  titleContainer: {
    boxShadow: theme.shadows.md,
    cursor: "pointer",
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[0],
    },
  },
  title: {
    // height: 60,
    width: "100%",
    textAlign: "left",
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

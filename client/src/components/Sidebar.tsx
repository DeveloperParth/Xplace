import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createInvitation, createServer, getServers } from "../api";
import { useServer } from "../store/useServer";
import { Category, Channel, PermissionTypes, Server } from "../types";
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
  ScrollArea,
  Box,
} from "@mantine/core";
import { IconHome2 } from "@tabler/icons";
import { IconPlus } from "@tabler/icons";
import { IconChevronDown } from "@tabler/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { IconUserPlus } from "@tabler/icons";
import { IconSettings } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import CreateChannelButton from "./Modals/CreateChannelButton";
import { IconHash } from "@tabler/icons";
import { useContextMenu } from "../store/useContextMenu";

function Sidebar() {
  const navigate = useNavigate();
  const handleContextMenu = useContextMenu((state) => state.handleContextMenu);
  const { serverId, channelId } = useParams<{
    serverId: string;
    channelId: string;
  }>();
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [serverName, setServerName] = useState("");
  const { classes, cx } = useStyles();
  const queryClient = useQueryClient();
  const server = useServer((state) => state.server);
  const currentChannel = useServer((state) => state.currentChannel);
  const setServer = useServer((state) => state.setServer);
  const setCurrentChannel = useServer((state) => state.setCurrentChannel);
  const hasPermission = useServer((state) => state.hasPermission);
  const { status, setStatus } = useAuth((state) => state);
  const { data } = useQuery({
    queryKey: ["servers"],
    queryFn: getServers,
  });

  const createServerMutation = useMutation({
    mutationFn: createServer,
    onSuccess: () => {
      queryClient.invalidateQueries(["servers"]);
    },
  });

  const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createServerMutation.mutate(serverName);
    setIsCreateServerOpen(false);
  };
  const handleServerChange = async (server: Server) => {
    setServer(server);
    console.log(server);

    queryClient.invalidateQueries(["messages"]);
    const channel =
      server.Channels?.[0] || server.Categories?.[0]?.Channels?.[0];
    if (channel) setCurrentChannel(channel);
    navigate(`/channels/${server.id}/${channel?.id}`);
  };
  const handleChannelChange = async (channel: Channel) => {
    await queryClient.invalidateQueries(["messages"]);
    setCurrentChannel(channel);
    navigate(`/channels/${server?.id}/${channel.id}`);
  };

  const [active, setActive] = useState(server?.id || serverId);
  const [activeLink, setActiveLink] = useState(currentChannel?.id || channelId);

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
            setActive(server.id);
            handleServerChange(server);
          }}
          className={cx(classes.mainLink, {
            [classes.mainLinkActive]: active === server.id,
          })}
          onContextMenu={(e) =>
            handleContextMenu({ e, type: "SERVER", content: server.id })
          }
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
    server?.Categories?.map((category: Category, i: number) => (
      <div key={category.id}>
        <div className={classes.link}>
          {category.name}
          {hasPermission(PermissionTypes.manageChannels) && (
            <CreateChannelButton
              serverId={server.id}
              categoryId={category.id}
            />
          )}
        </div>
        <div className={classes.subLinkContainer}>
          {category.Channels?.map((channel) => (
            <UnstyledButton
              className={cx(classes.subLink, {
                [classes.subLinkActive]: activeLink === channel.id,
              })}
              key={channel.id}
              onClick={() => {
                setActiveLink(channel.id);
                handleChannelChange(channel);
              }}
            >
              <IconHash />
              {channel.name}
            </UnstyledButton>
          ))}
        </div>
      </div>
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
      <Navbar height={750} width={{ sm: 70, xs: 70 }} sx={{ border: "none" }}>
        <Navbar.Section grow className={classes.wrapper}>
          <div className={classes.aside}>
            <div
              className={classes.logo}
              onClick={() => {
                setServer(null);
                setCurrentChannel(null);
                navigate("/channels/@me");
              }}
            >
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
        </Navbar.Section>
      </Navbar>
      <Navbar height={750} width={{ sm: 240 }} className={classes.subNavbar}>
        <Navbar.Section>
          {server && (
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
                {hasPermission(PermissionTypes.invitePeople) && (
                  <Menu.Item
                    icon={<IconUserPlus size={18} />}
                    onClick={invitePeopleHandler}
                  >
                    Invite people
                  </Menu.Item>
                )}
                <Menu.Item
                  icon={<IconSettings size={18} />}
                  onClick={() => navigate(`/server/${server?.id}/settings`)}
                >
                  Server settings
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Navbar.Section>
        <Navbar.Section grow>{links}</Navbar.Section>
        <Navbar.Section>
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
        </Navbar.Section>
      </Navbar>
      <Modal
        title="Create server"
        opened={isCreateServerOpen}
        onClose={() => setIsCreateServerOpen(false)}
        withCloseButton
        zIndex={1000}
      >
        <form onSubmit={formSubmitHandler}>
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
            type="submit"
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
      theme.colorScheme === "dark"
        ? theme.colors.discord[0]
        : theme.colors.gray[2],
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // borderRight: `1px solid ${
    //   theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    // }`,
  },

  subNavbar: {
    flex: 1,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.discord[1]
        : theme.colors.gray[1],
    border: "none",

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
    height: 50,
    boxShadow:
      "0 1px 0 rgba(4,4,5,0.2), 0 1.5px 0 rgba(6,6,7,0.05), 0 2px 0 rgba(4,4,5,0.05)",
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
    marginBottom: theme.spacing.xl,
  },

  link: {
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    padding: `${theme.spacing.xs}px 10px`,
    fontSize: theme.fontSizes.sm,
    cursor: "pointer",

    "&:hover": {
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  linkActive: {
    "&, &:hover": {
      borderLeftColor: theme.fn.variant({
        variant: "filled",
        color: theme.primaryColor,
      }).background,
      color: theme.white,
    },
  },
  subLinkContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    padding: `0px ${theme.spacing.xs}px`,
  },
  subLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    padding: `5px`,
    cursor: "pointer",
    borderRadius: theme.radius.sm,

    "&:hover": {
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[0],
    },
  },
  subLinkActive: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[0],
  },
}));

export default Sidebar;

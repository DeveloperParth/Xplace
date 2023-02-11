import {
  Avatar,
  Box,
  Group,
  Menu,
  Navbar,
  Tabs,
  Text,
  TextInput,
  createStyles,
} from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconSettings } from "@tabler/icons";
import { useServer } from "../../store/useServer";

function ServerSettingsButton() {
  const { classes } = useStyles();
  const server = useServer((state) => state.server);
  if (!server) return null;
  const openSettingsModal = () =>
    openModal({
      closeOnEscape: true,
      withCloseButton: false,
      fullScreen: true,
      padding: 0,
      children: (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            height: "100vh",
          }}
        >
          <Box className={classes.navContainer}>
            <nav className={classes.nav}>
              <Text color="dimmed" size="sm" className={classes.serverName}>
                {server.name}
              </Text>
              <Tabs
                orientation="vertical"
                variant="pills"
                defaultValue="general"
                color="dark"
              >
                <Tabs.List p={0} className={classes.list}>
                  <Tabs.Tab className={classes.tab} value="general">
                    General
                  </Tabs.Tab>
                  <Tabs.Tab className={classes.tab} value="channels">
                    Channels
                  </Tabs.Tab>
                  <Tabs.Tab className={classes.tab} value="roles">
                    Roles
                  </Tabs.Tab>
                  <Tabs.Tab className={classes.tab} value="members">
                    Members
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>
            </nav>
          </Box>
          <Box
            sx={(theme) => ({
              backgroundColor: theme.colors.discord[2],
              flex: "4 4",
              height: "100%",
            })}
          ></Box>
        </Box>
      ),
    });

  return (
    <Menu.Item icon={<IconSettings size={18} />} onClick={openSettingsModal}>
      Server settings
    </Menu.Item>
  );
}

const useStyles = createStyles((theme) => ({
  navContainer: {
    backgroundColor: theme.colors.discord[1],
    flex: "2 2",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  nav: {
    width: "218px",
    padding: "60px 6px 60px 20px",
  },
  list: {
    width: "100%",
  },
  serverName: {
    padding: "6px 10px",
  },
  tab: {
    padding: "10px",
  },
}));

export default ServerSettingsButton;

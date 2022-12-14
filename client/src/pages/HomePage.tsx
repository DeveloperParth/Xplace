import Messages from "../components/Messages/Messages";
import { useServer } from "../store/useServer";
import CreateMessage from "../components/Messages/CreateMessage";
import Members from "../components/Members";
import { Box, Group } from "@mantine/core";
function HomePage() {
  const { server, userRoles } = useServer((state) => state);

  return (
    <>
      {server?.id && (
        <>
          {/* <Group noWrap pos="relative"> */}
          <Box
            sx={(theme) => ({
              width: "100%",
              display: "flex",
              flexDirection: "column",
            })}
          >
            <Messages />
            <CreateMessage />
          </Box>
          <Members />
          {/* </Group> */}
        </>
      )}
    </>
  );
}

export default HomePage;

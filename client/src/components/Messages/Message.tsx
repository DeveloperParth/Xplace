import React from "react";
import { Text, Box, Avatar, Group } from "@mantine/core";
import { User } from "../../types";
import moment from "moment";
// prop types
type Props = {
  message: string;
  isSent?: boolean;
  user: User;
  createdAt: string;
};

function Message({ message, isSent, user, createdAt }: Props) {
  // return (
  //   <>
  //     <Box
  //       sx={(theme) => ({
  //         display: "flex",
  //         alignSelf: "flex-start",
  //         gap: 10,
  //         paddingInline: theme.spacing.md,
  //         paddingBlock: theme.spacing.xs,
  //       })}
  //     >
  //       <Avatar size="lg" radius="xl" src="https://i.pravatar.cc/300" />
  //       <div>
  //         <Group>
  //           <Text>{user.name}</Text>
  //           <Text size="sm" color="gray">
  //             {moment(createdAt).format("MMM DD YYYY hh:mm A")}
  //           </Text>
  //         </Group>
  //         <Text size="sm">{message}</Text>
  //       </div>
  //     </Box>
  //   </>
  // );
  const { classes } = useStyles();
  return (
    <div>
      <Group>
        <Avatar src="https://i.pravatar.cc/300" alt={user.name} radius="xl" />
        <div>
          <Text size="sm">{user.name}</Text>
          <Text size="xs" color="dimmed">
            {moment(createdAt).format("MMM DD YYYY hh:mm A")}
          </Text>
        </div>
      </Group>
      <Text className={classes.body} size="sm" maw="40%">
        {message}
      </Text>
    </div>
  );
}

import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm,
    wordBreak: "break-word",
  },
}));

interface CommentSimpleProps {
  postedAt: string;
  body: string;
  author: {
    name: string;
    image: string;
  };
}

export default Message;

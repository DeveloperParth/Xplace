import { Text, Avatar, Group, Tooltip, Button } from "@mantine/core";
import { createStyles } from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import { IconEdit } from "@tabler/icons";
import { IconArrowBackUp } from "@tabler/icons";
import { Message as IMessage, User } from "../../types";
import moment from "moment";
import { useMessage } from "../../store/useMessage";
import { IconArrowRight } from "@tabler/icons";
// prop types
type Props = {
  messageObject: IMessage;
  isSent?: boolean;
  isSameUser?: boolean;
};

function Message({ messageObject, isSameUser, isSent }: Props) {
  const {
    text: message,
    user,
    createdAt,
    ReplyTo,
    replyToId,
    id,
  } = messageObject;
  const { classes, cx } = useStyles();
  const setReplyingTo = useMessage((state) => state.setReplyingTo);

  const handleReply = () => {
    setReplyingTo(messageObject);
  };
  if (isSameUser && !replyToId)
    return (
      <Group
        className={cx(classes.messageWrapper, {
          [classes.sameUser]: isSameUser,
        })}
      >
        <Tooltip
          label={moment(createdAt).format("dddd, MMM,DD,YYYY hh:mm A")}
          withArrow
          color="dark"
        >
          <div>
            <Text
              size={11}
              color="dimmed"
              className="hiddenTime"
              sx={{
                opacity: 0,
                pointerEvents: "none",
              }}
            >
              {moment(createdAt).format("hh:mm A")}
            </Text>
          </div>
        </Tooltip>

        <Text className={classes.body}>{message}</Text>
      </Group>
    );
  return (
    <>
      <div className={classes.messageWrapper} id={`message-${id}`}>
        {replyToId && (
          <>
            <Group spacing="xs">
              <IconArrowRight color="green" />
              <Text>{ReplyTo?.text}</Text>
            </Group>
          </>
        )}

        <Group spacing="lg">
          <Avatar
            src="https://i.pravatar.cc/300"
            alt={user.name}
            radius="xl"
            size={41}
          />
          <div>
            <Group spacing={3} align="center">
              <Text size="md" className={classes.username}>
                {user.name}
              </Text>
              &middot;
              <Tooltip
                label={moment(createdAt).format("dddd, MMM,DD,YYYY hh:mm A")}
                withArrow
                color="dark"
              >
                <Text size="xs" color="dimmed">
                  {moment(createdAt).format("DD/MM/YYYY hh:mm A")}
                </Text>
              </Tooltip>
            </Group>
            <Text className={classes.body}>{message}</Text>
          </div>
          <div>
            <Button.Group buttonBorderWidth={1}>
              <Tooltip label="Reply" withArrow color="dark">
                <Button p={5} variant="subtle" onClick={handleReply}>
                  <IconArrowBackUp size={24} />
                </Button>
              </Tooltip>
              <Tooltip label="Edit" withArrow color="dark">
                <Button p={5} variant="subtle">
                  <IconEdit size={24} />
                </Button>
              </Tooltip>
              <Tooltip label="Delete" withArrow color="dark">
                <Button p={5} variant="subtle">
                  <IconTrash size={24} />
                </Button>
              </Tooltip>
            </Button.Group>
          </div>
        </Group>
      </div>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  messageWrapper: {
    marginTop: theme.spacing.md,
    paddingInline: theme.spacing.xs,
    paddingBlock: 1,
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    },
    "&:hover .hiddenTime": {
      opacity: 1,
    },
  },
  sameUser: {
    marginTop: 0,
  },

  body: {
    color:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.white, 0.65)
        : theme.black,
    // wordBreak: "break-word",
  },
  username: {
    fontWeight: 500,
    pointerEvents: "none",
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

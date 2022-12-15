import {
  Text,
  Avatar,
  Group,
  Tooltip,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { createStyles } from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import { IconEdit } from "@tabler/icons";
import { IconArrowBackUp } from "@tabler/icons";
import { Message as IMessage } from "../../types";
import moment from "moment";
import { useMessage } from "../../store/useMessage";
import { IconArrowRight } from "@tabler/icons";
import { useAuth } from "../../store/useAuth";
// prop types
type Props = {
  messageObject: IMessage;
  isSent?: boolean;
  isSameUser?: boolean;
};

function Message({ messageObject, isSameUser }: Props) {
  const {
    user,
    createdAt,
    ReplyTo,
    replyToId,
    id,
  } = messageObject;
  const { classes, cx } = useStyles();

  const scrollToMessage = () => {
    const message = document.getElementById(`message-${replyToId}`);

    if (message) {
      message.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      setTimeout(() => {
        message?.classList.add("highlight");
        setTimeout(() => {
          message?.classList.remove("highlight");
        }, 1000);
      }, 200);
    }
  };
  if (isSameUser && !replyToId)
    return (
      <div
        className={cx(classes.messageWrapper, classes.sameUser)}
        id={`message-${id}`}
      >
        <Group>
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

          <MainMessageSection messageObject={messageObject} />
          <MassageButtons messageObject={messageObject} />
        </Group>
      </div>
    );
  return (
    <>
      <div className={classes.messageWrapper} id={`message-${id}`}>
        {replyToId && (
          <>
            <Group spacing="xs" onClick={scrollToMessage}>
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
                <div>
                  <Text size="xs" color="dimmed" className="p-none">
                    {moment(createdAt).format("DD/MM/YYYY hh:mm A")}
                  </Text>
                </div>
              </Tooltip>
            </Group>
            <MainMessageSection messageObject={messageObject} />
          </div>
          <MassageButtons messageObject={messageObject} />
        </Group>
      </div>
    </>
  );
}
const MassageButtons = ({ messageObject }: { messageObject: IMessage }) => {
  const { user } = messageObject;
  const loggedUser = useAuth((state) => state.user);
  const { setEditing, setReplyingTo } = useMessage((state) => state);

  const { classes, cx } = useStyles();

  const handleReply = () => {
    setReplyingTo(messageObject);
  };
  const handleEdit = () => {
    setEditing(messageObject);
  };
  const handleDelete = () => {
    console.log("delete");
  };
  return (
    <div className={cx(classes.messageButtons, "message-buttons")}>
      <Group spacing={0}>
        <SingleButton tooltip="Reply" onClick={handleReply}>
          <IconArrowBackUp size={24} />
        </SingleButton>
        {loggedUser?.id === user.id && (
          <>
            <SingleButton tooltip="Edit" onClick={handleEdit}>
              <IconEdit size={24} />
            </SingleButton>
            <SingleButton tooltip="Delete" onClick={handleDelete}>
              <IconTrash size={24} />
            </SingleButton>
          </>
        )}
      </Group>
    </div>
  );
};
const MainMessageSection = ({ messageObject }: { messageObject: IMessage }) => {
  
  const { id, text: message, isEdited, updatedAt } = messageObject;
  const { classes } = useStyles();
  const { setEditing, editing, editMessage } = useMessage((state) => state);
  if (editing?.id === id) {
    return (
      <TextInput
        value={editing.text}
        onChange={(e) => {
          setEditing({ ...editing, text: e.currentTarget.value });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            editMessage();
          }
          if (e.key === "Escape") {
            setEditing(null);
          }
        }}
      />
    );
  }

  return (
    <Text className={classes.body}>
      {message}
      {isEdited && (
        <Tooltip
          withArrow
          color="dark"
          label={moment(updatedAt).format("dddd, DD MMMM,YYYY hh:mm A")}
        >
          <div>
            <Text size="xs" color="dimmed" ml="xs" className="p-none">
              Edited
            </Text>
          </div>
        </Tooltip>
      )}
    </Text>
  );
};
const SingleButton = ({
  children,
  tooltip,
  onClick,
}: {
  children: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
}) => {
  return (
    <Tooltip label={tooltip} withArrow color="dark">
      <UnstyledButton
        onClick={onClick}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 0,
          m: 0,
          width: 40,
          height: 40,
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.3)",
          },
        }}
      >
        {children}
      </UnstyledButton>
    </Tooltip>
  );
};
const useStyles = createStyles((theme) => ({
  messageWrapper: {
    position: "relative",
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
    "&:hover .message-buttons": {
      display: "inline-block",
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
    display: "flex",
    alignItems: "flex-end",
    // wordBreak: "break-word",
  },
  username: {
    fontWeight: 500,
    pointerEvents: "none",
  },
  messageButtons: {
    display: "none",
    position: "absolute",
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.sm,
    overflow: "hidden",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    right: 0,
    top: 0,
    transform: "translate(-50%, -50%)",
  },
}));


export default Message;

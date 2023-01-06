import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { createMessage } from "../../api";
import { useServer } from "../../store/useServer";
import { createStyles, TextInput } from "@mantine/core";
import { useMessage } from "../../store/useMessage";

function CreateMessage() {
  const { classes, cx } = useStyles();
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const server = useServer((state) => state.server);
  const currentChannel = useServer((state) => state.currentChannel);
  const replyingTo = useMessage((state) => state.replyingTo);
  const mutation = useMutation({
    mutationFn: () =>
      createMessage({
        serverId: server?.id!,
        channelId: currentChannel?.id!,
        text: message,
        replyTo: replyingTo?.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });
  const createMessageHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
    setMessage("");
  };
  return (
    <div
      className={cx(classes.formWrapper, {
        [classes.noBorderRaduis]: replyingTo !== null,
      })}
    >
      {replyingTo && (
        <div className={classes.replyingTo}>
          Replying to <b>{replyingTo?.user.name}</b>
        </div>
      )}
      <form onSubmit={createMessageHandler}>
        <TextInput
          variant="filled"
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Message"
          className="message-input"
          radius="md"
        />
      </form>
    </div>
  );
}

const useStyles = createStyles((theme) => ({
  formWrapper: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing.md,
  },
  replyingTo: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[2],
    fontSize: theme.fontSizes.sm,
    borderTopLeftRadius: theme.radius.md,
    borderTopRightRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    padding: theme.spacing.sm,
  },
  noBorderRaduis: {
    form: {
      ".message-input input": {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      },
    },
  },
}));
export default CreateMessage;

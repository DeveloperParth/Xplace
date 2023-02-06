import { openModal } from "@mantine/modals";
import { TextInput, Button, ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { useMutation } from "@tanstack/react-query";
import { createChannel } from "../../api";
import { useState } from "react";
import { queryClient } from "../../main";
const CreateChannelButton = ({
  categoryId,
  serverId,
}: {
  categoryId: string;
  serverId: string;
}) => {
  const [input, setInput] = useState<{
    name: string;
    type: "text" | "voice";
    categoryId: string;
    serverId: string;
  }>({
    name: "",
    type: "text",
    serverId,
    categoryId,
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createChannelMutation.mutateAsync(input);
  };

  const showModal = () =>
    openModal({
      title: "Delete your profile",

      children: (
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Channel Name"
            // value={input.channelName}
            required
            onChange={(e) => {
              setInput((prev) => {
                return { ...prev, name: e.target.value };
              });
            }}
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
      ),
    });

  const createChannelMutation = useMutation({
    mutationFn: createChannel,
    onSuccess: () => {
      queryClient.invalidateQueries(["servers"]);
    },
  });

  return (
    <ActionIcon size="sm" onClick={showModal}>
      <IconPlus />
    </ActionIcon>
  );
};

export default CreateChannelButton;

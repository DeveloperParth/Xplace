import { showNotification } from "@mantine/notifications";
import create from "zustand";
import { updateMessage } from "../api";
import { Message } from "../types";
import { useServer } from "./useServer";

// zustand hook
type MessageState = {
  replyingTo: Message | null;
  setReplyingTo: (message: Message | null) => void;

  editing: Message | null;
  setEditing: (message: Message | null) => void;

  editMessage: () => void;
};

export const useMessage = create<MessageState>((set, get) => ({
  // state
  replyingTo: null,
  editing: null,

  // actions
  setReplyingTo: (message: Message | null) => {
    return set({ replyingTo: message });
  },
  setEditing: (message: Message | null) => {
    return set({ editing: message });
  },
  editMessage: async () => {
    const { editing } = get();
    if (!editing) return;
    useServer.getState().setMessages((messages) => {
      const index = messages.findIndex((m) => m.id === editing?.id);
      if (index !== -1) {
        messages[index] = editing!;
      }
      return [...messages];
    });
    set({ editing: null });
    try {
      await updateMessage(editing!.id, editing!.text);
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to edit message",
        color: "red",
      });
    }
  },
}));

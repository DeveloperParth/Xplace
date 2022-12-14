import create from "zustand";
import { Message } from "../types";

// zustand hook
type MessageState = {
  replyingTo: Message | null;
  setReplyingTo: (message: Message | null) => void;
};

export const useMessage = create<MessageState>((set, get) => ({
  // state
  replyingTo: null,

  // actions
  setReplyingTo: (message: Message | null) => {
    return set({ replyingTo: message });
  },
}));

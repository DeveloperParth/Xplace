import create from "zustand";
import { useQueryClient } from "@tanstack/react-query";
import { Server, User } from "../types";

// zustand hook
type ServerState = {
  server: Server | null;
  setServer: (server: Server | null) => void;
};

export const useServer = create<ServerState>((set, get) => ({
  // state
  server: null,
  messages: [],
  // actions
  setServer: (server: Server | null) => set({ server }),
}));

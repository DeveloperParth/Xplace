import create from "zustand";
import { persist } from "zustand/middleware";
import { loginUser } from "../api";
import { Server, User } from "../types";

// zustand hook
type ServerState = {
  server: Server | null;
  setServer: (server: Server | null) => void;
};

export const useServer = create<ServerState>((set, get) => ({
  // state
  server: null,
  // actions
  setServer: (server: Server | null) => set({ server }),
}));

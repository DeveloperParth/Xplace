import create from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, registerUser } from "../api";
import { socket } from "../App";
import { queryClient } from "../main";
import { User } from "../types";

// zustand hook
type AuthState = {
  user: User | null;
  token: string | null;
  status: "Idle" | "DND" | null;
  login: (email: string, password: string) => void;
  register: (email: string, password: string, name: string) => void;
  logout: () => void;
  setStatus: (status: "Idle" | "DND" | null) => void;
};

export const useAuth = create(
  persist<AuthState>(
    (set, get) => ({
      // state
      user: null,
      token: null,
      status: null,
      // actions
      login: async (email: string, password: string) => {
        const { user, token } = await loginUser(email, password);

        set({ user, token });
      },
      register: async (email: string, password: string, name: string) => {
        const { user, token } = await registerUser(email, password, name);
        set({ user, token });
      },
      logout: () => {
        set({ user: null, token: null });
      },
      setStatus: (status = null as "Idle" | "DND" | null) => {
        socket.emit("status", { status });
        queryClient.invalidateQueries(["members"]);
        set({ status });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

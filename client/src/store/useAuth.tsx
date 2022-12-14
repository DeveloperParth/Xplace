import create from "zustand";
import { persist } from "zustand/middleware";
import { loginUser } from "../api";
import { socket } from "../App";
import { queryClient } from "../main";
import { User } from "../types";

// zustand hook
type AuthState = {
  user: User | null;
  token: string | null;
  status: "Idle" | "DND" | null;
  login: (email: string, password: string) => void;
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
        console.log("user", user);

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

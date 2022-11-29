import create from "zustand";
import { persist } from "zustand/middleware";
import { loginUser } from "../api";
import { User } from "../types";

// zustand hook
type AuthState = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => void;
  logout: () => void;
};

export const useAuth = create(
  persist<AuthState>(
    (set, get) => ({
      // state
      user: null,
      token: null,
      // actions
      login: async (email: string, password: string) => {
        const { user, token } = await loginUser(email, password);
        console.log("user", user);

        set({ user, token });
      },
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

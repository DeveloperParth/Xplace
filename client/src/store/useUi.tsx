import create from "zustand";

interface UiState {
  profileCard: string | null;
  setProfileCard: (id: string) => void;
}

export const useUi = create<UiState>((set) => ({
  profileCard: null,
  setProfileCard: (id: string) => {
    set({ profileCard: id });
  },
}));

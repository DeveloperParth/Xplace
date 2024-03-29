import create from "zustand";
import { ContextMenuWidth } from "../components/ContextMenu";

type TypeStates =
  | "USER"
  | "CHANNEL"
  | "SERVER"
  | "MESSAGE"
  | "ROLE"
  | "CHANNEL"
  | null;

interface ContextMenuState {
  show: boolean;
  x: number;
  y: number;
  type: TypeStates;
  content: string;

  setContextMenu: (contextMenu: Partial<ContextMenuState>) => void;
  handleContextMenu: ({
    e,
    type,
    content,
  }: {
    e: any;
    type: TypeStates;
    content: string;
  }) => void;
}

export const useContextMenu = create<ContextMenuState>((set) => ({
  show: false,
  x: 0,
  y: 0,
  type: null,
  content: "",
  setContextMenu: (contextMenu: Partial<ContextMenuState>) => {
    set((prevState) => ({ ...prevState, ...contextMenu }));
  },
  handleContextMenu: ({ e, type, content }) => {
    e.preventDefault();
    set((prevState) => ({
      x:  e.clientX > document.body.clientWidth - ContextMenuWidth
      ? e.clientX - ContextMenuWidth
      : e.clientX,
      y: e.clientY,
      show: true,
      type,
      content,
    }));
  },
}));

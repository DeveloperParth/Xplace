import create from "zustand";
import { Message, Permission, Role, Server, User } from "../types";
import { socket } from "../App";

// zustand hook
type ServerState = {
  server: Server | null;
  messages: Message[];
  onlineUsers: User[];
  roles: Role[];
  userRoles: Role[];
  setMembers: (members: User[]) => void;
  setServer: (server: Server | null) => void;
  setMessages: (callback: (messages: Message[]) => Message[]) => void;
};

export const useServer = create<ServerState>((set, get) => ({
  // state
  server: null,
  messages: [],
  onlineUsers: [],
  roles: [],
  userRoles: [],
  // actions
  setServer: (server: Server | null) => {
    socket.emit("members", server?.id);
    set({
      server,
      roles: server?.Roles || [],
    });
  },
  setMembers: (members: User[]) => {
    return set({ onlineUsers: members });
  },
  setMessages: (callback) => {
    return set({ messages: callback(get().messages) });
  },
  setUserRoles: (roles: Role[]) => {
    return set({ userRoles: roles });
  },
  setRoles: (roles: Role[]) => {
    return set({ roles });
  },
}));

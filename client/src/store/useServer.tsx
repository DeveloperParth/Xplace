import create from "zustand";
import {
  Message,
  Channel,
  Role,
  Server,
  User,
  PermissionTypes,
} from "../types";
import { useAuth } from "./useAuth";

// type definitions for keyvalue pairs
type Permission = {
  name: PermissionTypes;
  allowed: boolean;
};
// zustand hook
type ServerState = {
  server: Server | null;
  currentChannel: Channel | null;
  messages: Message[];
  members: User[];
  roles: Role[];
  permissions: Permission[];
  isOwner: boolean;
  setMembers: (members: User[]) => void;
  setServer: (server: Server | null) => void;
  setCurrentChannel: (channel: Channel | null) => void;
  setMessages: (callback: (messages: Message[]) => Message[]) => void;
  hasPermission: (permission: string) => boolean;
};

// const log = (config) => (set: , get, api) =>
//   config(
//     (...args) => {
//       console.log("  applying", args);
//       set(...args);
//       console.log("  new state", get());
//     },
//     get,
//     api
//   );

export const useServer = create<ServerState>((set, get) => ({
  // state
  server: null,
  currentChannel: null,
  messages: [],
  members: [],
  roles: [],
  permissions: [],
  isOwner: false,
  // actions
  setServer: (server: Server | null) => {
    const isOwner = useAuth.getState().user?.id === server?.ownerId;

    set({
      server,
      roles: server?.Roles || [],
      isOwner,
      permissions: server?.Members?.[0]?.Role?.Permissions?.map((p) => {
        return { name: p.Permission.name, allowed: p.allowed } as Permission;
      }) || [],
    });
  },
  setCurrentChannel: (channel: Channel | null) => {
    set({ currentChannel: channel });
  },
  setMembers: (members: User[]) => {
    return set({ members: members });
  },
  setMessages: (callback) => {
    return set({ messages: callback(get().messages) });
  },
  setRoles: (roles: Role[]) => {
    return set({ roles });
  },
  hasPermission: (permission) => {
    return (
      get().permissions.find((p) => p.name === permission)?.allowed ||
      get().isOwner
    );
  },
}));

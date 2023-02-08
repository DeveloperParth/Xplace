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
  [key in PermissionTypes]?: boolean;
};
// zustand hook
type ServerState = {
  server: Server | null;
  currentChannel: Channel | null;
  messages: Message[];
  members: User[];
  roles: Role[];
  permissions: Permission;
  isOwner: boolean;
  setMembers: (members: User[]) => void;
  setServer: (server: Server | null) => void;
  setCurrentChannel: (channel: Channel | null) => void;
  setMessages: (callback: (messages: Message[]) => Message[]) => void;
  hasPermission: (permission: PermissionTypes) => boolean;
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

    // const permissions = server?.Members?.[0]?.Roles?.map((role) => {
    //   return role.Permissions?.map((permission) => {
    //     return {
    //       name: permission.Permission.name,
    //       allowed: permission.allowed,
    //     };
    //   });
    // });
    // console.log(permissions);
    const permissions: any = {};
    server?.Members?.[0]?.Roles?.map((role) => {
      role.Permissions?.map((permission) => {
        const name = permission.Permission.name;
        if (permissions[name] && !permissions[name].allowed) {
          permissions[name].allowed = permission.allowed;
        } else if (!permissions[name]) {
          permissions[name] = permission.allowed;
        }
      });
    });
    console.log(permissions);

    set({
      server,
      roles: server?.Roles || [],
      isOwner,
      permissions,
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
    return get().permissions[permission] || get().isOwner;
  },
}));

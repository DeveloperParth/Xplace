export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  name: string;
  password: string;
  status: Status;
  ownedServers?: Server[];
  joinedServers?: ServerMember[];
  Message?: Message[];
  Invitation?: Invitation[];
}

export interface Role {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  color: string;
  Server: Server;
  serverId: string;
  Permissions?: PermissionsOnRole[];
  Users?: ServerMember[];
}

export interface PermissionsOnRole {
  createdAt: Date;
  updatedAt: Date;
  Role: Role;
  roleId: string;
  Permission: Permission;
  permissionId: string;
  allowed: boolean;
}

export interface Permission {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: PermissionTypes;
  Roles?: PermissionsOnRole[];
}

export interface Invitation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  code: string;
  Server: Server;
  serverId: string;
  User: User;
  userId: string;
}

export interface Server {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  photo?: string;
  Owner: User;
  ownerId: string;
  Roles?: Role[];
  Invite?: Invitation[];
  Channels?: Channel[];
  Categories?: Category[];
  Message?: Message[];
  Members?: ServerMember[];
}

export interface ServerMember {
  createdAt: Date;
  updatedAt: Date;
  Server: Server;
  serverId: string;
  User: User;
  userId: string;
  Role?: Role;
  roleId?: string;
}

export interface Category {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  Server: Server;
  serverId: string;
  Channels?: Channel[];
}

export interface Channel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  Server: Server;
  serverId: string;
  Messages?: Message[];
  type: ChannelTypes;
  Category?: Category;
  categoryId?: string;
}

export interface Message {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  isEdited: boolean;
  user: User;
  userId: string;
  Server?: Server;
  serverId?: string;
  ReplyTo?: Message;
  replyToId?: string;
  Replies?: Message[];
  Channel?: Channel;
  channelId?: string;
}

export enum Status {
  Online = "Online",
  Offline = "Offline",
  Idle = "Idle",
  DND = "DND",
}

export enum PermissionTypes {
  invitePeople = "invitePeople",
  kickPeople = "kickPeople",
  banPeople = "banPeople",
  manageRoles = "manageRoles",
  manageChannels = "manageChannels",
  manageServer = "manageServer",
  manageInvites = "manageInvites",
  manageMessages = "manageMessages",
}

export enum ChannelTypes {
  text = "text",
  voice = "voice",
}

// prisma enum to typescript enum
//

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  name: string;
  password: string;
  status: Status;
  ownedServers?: Server[];
  joinedServers?: Server[];
  Message?: Message[];
  Roles?: Role[];
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
  Users?: User[];
  Permission?: Permission[];
}

export interface Permission {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  Roles?: Role[];
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
  Members?: User[];
  Messages?: Message[];
  Roles?: Role[];
  Invite?: Invitation[];
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
}

export enum Status {
  Online = 'Online',
  Offline = 'Offline',
  Idle = 'Idle',
  DND = 'DND',
}

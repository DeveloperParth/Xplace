export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  name: string;
  password: string;
  ownedServers?: Server[];
  joinedServers?: Server[];
  Message?: Message[];
}

export interface Server {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  owner: User;
  ownerId: string;
  members?: User[];
  Message?: Message[];
}

export interface Message {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  user: User;
  userId: string;
  Server?: Server;
  serverId?: string;
}

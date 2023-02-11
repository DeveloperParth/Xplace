import Api from "./BaseInstace";
export async function loginUser(email: string, password: string) {
  const { data } = await Api.post("/api/auth/login", { email, password });
  return data;
}
export async function registerUser(
  email: string,
  name: string,
  password: string
) {
  const { data } = await Api.post("/api/auth/register", {
    email,
    password,
    name,
  });
  return data;
}

// Servers
export async function getServers() {
  const { data } = await Api.get("/api/servers");
  return data;
}
export async function getServer(id: string) {
  const { data } = await Api.get(`/api/servers/${id}`);
  return data;
}
export async function createServer(name: string) {
  const { data } = await Api.post("/api/servers", { name });
  return data;
}
export async function joinServer(code: string) {
  const { data } = await Api.post(`/api/servers/join/${code}`);
  return data;
}

// Channels
export async function getChannels(serverId: string) {
  const { data } = await Api.get(`/api/servers/${serverId}/channels`);
  return data;
}
export async function createChannel({
  serverId,
  name,
  type,
  categoryId,
}: {
  serverId: string;
  name: string;
  type: "text" | "voice";
  categoryId?: string;
}) {
  const { data } = await Api.post(`/api/servers/${serverId}/channel`, {
    name,
    type,
    categoryId,
  });
  return data;
}

export async function deleteChannel(id: string) {
  const { data } = await Api.delete(`/api/channels/${id}`);
  return data;
}

// Invitations
export async function createInvitation(serverId: string) {
  const { data } = await Api.post(`/api/servers/${serverId}/invite`);
  return data;
}

export async function getInvitation(code: string) {
  const { data } = await Api.get(`/api/servers/join/${code}`);
  return data;
}

export async function getMembers(id: string) {
  const { data } = await Api.get(`/api/servers/${id}/members`);
  return data;
}

export async function getMessages({
  serverId,
  channelId,
}: {
  serverId: string;
  channelId: string;
}) {
  const { data } = await Api.get(
    `/api/servers/${serverId}/${channelId}/messages`
  );
  return data;
}
export async function createMessage({
  serverId,
  channelId,
  text,
  replyTo,
}: {
  serverId: string;
  channelId: string;
  text: string;
  replyTo?: string;
}) {
  const { data } = await Api.post(`/api/messages/`, {
    text,
    replyTo,
    serverId,
    channelId,
  });
  return data;
}

export async function updateMessage(id: string, text: string) {
  const { data } = await Api.put(`/api/messages/${id}`, { text });
  return data;
}

export async function deleteMessage(id: string) {
  const { data } = await Api.delete(`/api/messages/${id}`);
  return data;
}

export async function getRoles(id: string) {
  const { data } = await Api.get<Entity.Role[]>(`/api/servers/${id}/roles`);
  return data;
}

export async function addUserToRole({
  serverId,
  userId,
  roleId,
}: {
  serverId: string;
  userId: string;
  roleId: string;
}) {
  const { data } = await Api.patch(`/api/roles/add-user`, {
    serverId,
    userId,
    roleId,
  });
  return data;
}

export async function removeUserFromRole({
  serverId,
  userId,
  roleId,
}: {
  serverId: string;
  userId: string;
  roleId: string;
}) {
  const { data } = await Api.patch(`/api/roles/remove-user`, {
    serverId,
    userId,
    roleId,
  });
  return data;
}

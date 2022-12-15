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

export async function getMessages(serverId: string) {
  const { data } = await Api.get(`/api/servers/${serverId}/messages`);
  return data;
}
export async function createMessage(
  serverId: string,
  text: string,
  replyTo?: string
) {
  const { data } = await Api.post(`/api/messages/${serverId}`, {
    text,
    replyTo,
  });
  return data;
}

export async function updateMessage(id: string, text: string) {
  const { data } = await Api.put(`/api/messages/${id}`, { text });
  return data;
}

import Api from "./BaseInstace";
export async function loginUser(email: string, password: string) {
  const { data } = await Api.post("/api/users/login", { email, password });
  return data;
}

export async function getServers() {
  const { data } = await Api.get("/api/servers");
  return data;
}
export async function createServer(name: string) {
  const { data } = await Api.post("/api/servers", { name });
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
export async function createMessage(serverId: string, text: string) {
  const { data } = await Api.post(`/api/messages/${serverId}`, { text });
  return data;
}

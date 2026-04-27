const API_BASE = `${import.meta.env.BASE_URL}api`;

const TOKEN_KEY = "codefolio_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = false, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...((headers as Record<string, string>) ?? {}),
  };
  if (auth) {
    const token = getToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers: finalHeaders });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string } & Record<
    string,
    unknown
  >;
  if (!res.ok || data.ok === false) {
    throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
  }
  return data as T;
}

export const api = {
  register: (body: { name: string; email: string; username: string; password: string }) =>
    request<{ ok: true; token: string; user: import("./types").PublicUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    request<{ ok: true; token: string; user: import("./types").PublicUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  me: () =>
    request<{ ok: true; user: import("./types").PublicUser }>("/auth/me", { auth: true }),
  getPublicPortfolio: (username: string) =>
    request<{
      ok: true;
      user: import("./types").PublicUser;
      projects: import("./types").Project[];
      skills: import("./types").Skill[];
    }>(`/user/${encodeURIComponent(username)}`),
  updateUser: (body: Partial<import("./types").PublicUser>) =>
    request<{ ok: true; user: import("./types").PublicUser }>("/user/update", {
      method: "PUT",
      auth: true,
      body: JSON.stringify(body),
    }),
  listProjects: () =>
    request<{ ok: true; projects: import("./types").Project[] }>("/projects", { auth: true }),
  createProject: (body: Partial<import("./types").Project>) =>
    request<{ ok: true; project: import("./types").Project }>("/projects", {
      method: "POST",
      auth: true,
      body: JSON.stringify(body),
    }),
  updateProject: (id: string, body: Partial<import("./types").Project>) =>
    request<{ ok: true; project: import("./types").Project }>(`/projects/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(body),
    }),
  deleteProject: (id: string) =>
    request<{ ok: true }>(`/projects/${id}`, { method: "DELETE", auth: true }),
  listSkills: () =>
    request<{ ok: true; skills: import("./types").Skill[] }>("/skills", { auth: true }),
  createSkill: (body: Partial<import("./types").Skill>) =>
    request<{ ok: true; skill: import("./types").Skill }>("/skills", {
      method: "POST",
      auth: true,
      body: JSON.stringify(body),
    }),
  updateSkill: (id: string, body: Partial<import("./types").Skill>) =>
    request<{ ok: true; skill: import("./types").Skill }>(`/skills/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(body),
    }),
  deleteSkill: (id: string) =>
    request<{ ok: true }>(`/skills/${id}`, { method: "DELETE", auth: true }),
  contact: (body: { username: string; name: string; email: string; message: string }) =>
    request<{ ok: true }>("/contact", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

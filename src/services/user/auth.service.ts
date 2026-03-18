import api from "../api";

export interface LoginResponse {
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", credentials);

    return data;
  },

  async me(): Promise<LoginResponse> {
    const { data } = await api.get<LoginResponse>("/auth/me");

    return data;
  },

  async logout() {
    await api.post<LoginResponse>("/auth/logout");
    window.location.href = "/login";
  },
};

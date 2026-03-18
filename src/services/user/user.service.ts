import api from "../api";

export interface UpdateProfilePayload {
  name?: string;
  password?: string;
}

export const userService = {
  async updateProfile(id: string, payload: UpdateProfilePayload) {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data;
  },

  async me() {
    const { data } = await api.get("/auth/me");
    return data;
  }
};

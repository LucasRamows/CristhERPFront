import api from "../api";

export interface RestaurantUpdatePayload {
  totalTables?: number;
}

export const restaurantService = {
  async updateRestaurant(id: string, payload: RestaurantUpdatePayload) {
    const { data } = await api.patch(`/restaurants/${id}/tables`, payload);
    return data;
  },

  async getMyRestaurant() {
    const { data } = await api.get("/restaurants");
    return data;
  }
};

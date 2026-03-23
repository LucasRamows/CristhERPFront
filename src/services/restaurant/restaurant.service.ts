import api from "../api";

export const restaurantService = {
  async updateTables(totalTables: number) {
    const { data } = await api.patch(`/restaurants/tables`, {
      tables: totalTables,
    });
    return data;
  },

  async getMyRestaurant() {
    const { data } = await api.get("/restaurants");
    return data;
  },
};

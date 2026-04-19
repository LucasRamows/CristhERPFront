import api from "../api";

export const restaurantService = {
  async updateTables(totalTables: number) {
    const { data } = await api.patch(`/businesses/tables`, {
      tables: totalTables,
    });
    return data;  
  },

  async getMyRestaurant() {
    const { data } = await api.get("/businesses");
    return data;
  },

  async createProductCategory(name: string) {
    const { data } = await api.post("/product-categories", { name });
    return data;
  },

  async createSupplierCategory(name: string) {
    const { data } = await api.post("/supplier-categories", { name });
    return data;
  },

  async deleteProductCategory(id: string) {
    const { data } = await api.delete(`/product-categories/${id}`);
    return data;
  },

  async deleteSupplierCategory(id: string) {
    const { data } = await api.delete(`/supplier-categories/${id}`);
    return data;
  },
};

import api from "../api";
import { mapProductData } from "./ProductsMappers";
import type {
  ProductsResponse,
  CreateProductRequest,
  ProductsStatsResponse,
} from "./products.types";

export const productsService = {
  async getProducts(): Promise<ProductsResponse[]> {
    const { data } = await api.get<ProductsResponse[]>("/products");
    return data.map(mapProductData);
  },

  async getProductsActive(): Promise<ProductsResponse[]> {
    const { data } = await api.get<ProductsResponse[]>("/products/active");
    return data.map(mapProductData);
  },

  async createProduct(
    product: CreateProductRequest,
  ): Promise<ProductsResponse> {
    const { data } = await api.post<ProductsResponse>("/products", product);
    return mapProductData(data);
  },

  async updateProduct(
    id: string,
    product: Partial<ProductsResponse>,
  ): Promise<ProductsResponse> {
    const { data } = await api.patch<ProductsResponse>(
      `/products/${id}`,
      product,
    );
    return mapProductData(data);
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async updateProductStatus(id: string): Promise<ProductsResponse> {
    const { data } = await api.patch<ProductsResponse>(
      `/products/${id}/status`,
    );
    return data;
  },

  async getProductStats(id: string): Promise<ProductsStatsResponse[]> {
    const { data } = await api.get<ProductsStatsResponse[]>(
      `/products/${id}/sales`,
    );
    return data;
  },
};

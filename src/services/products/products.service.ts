import api from "../api";

export interface ProductsResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  category: {
    name: string;
  };
  categoryId: string;
  unit: "UN" | "KG";
  price: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsUpload {
  code: string;
  name: string;
  description: string;
  categoryId: string;
  unit: "UN" | "KG";
  price: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface CreateProductRequest {
  code: string;
  name: string;
  description: string;
  categoryId: string;
  unit: "UN" | "KG";
  price: number;
  status: boolean;
}
export interface SelectedProductForObs extends ProductsResponse {
  obs: string[];
  quantity: number;
}
export interface CreateOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  notes: string[];
}

export interface CreateOrderRequest {
  orderType: string;
  reference: string;
  operatorId: string;
  total: number;
  items: CreateOrderItem[];
}

export interface AddItemToOrderRequest {
  items: CreateOrderItem[];
}

export interface CloseOrderResponse {
  message: string;
}

export interface ProductsStatsResponse {
  sales_date: string;
  quantity: number;
}

export const productsService = {
  async getProducts(): Promise<ProductsResponse[]> {
    const { data } = await api.get<ProductsResponse[]>("/products");

    return data;
  },

  async getProductsActive(): Promise<ProductsResponse[]> {
    const { data } = await api.get<ProductsResponse[]>("/products/active");

    return data;
  },

  async createProduct(
    product: CreateProductRequest,
  ): Promise<ProductsResponse> {
    const { data } = await api.post<ProductsResponse>("/products", product);
    return data;
  },

  async updateProduct(
    id: string,
    product: Partial<ProductsResponse>,
  ): Promise<ProductsResponse> {
    const { data } = await api.patch<ProductsResponse>(
      `/products/${id}`,
      product,
    );
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async updateProductStatus(
    id: string,
    status: boolean,
  ): Promise<ProductsResponse> {
    const { data } = await api.patch<ProductsResponse>(
      `/products/${id}/status`,
      { status },
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

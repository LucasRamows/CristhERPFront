import api from "../api";

export interface OpenOrdersResponse {
  id: string;
  restaurantId: string;
  orderType: string;
  reference: string;
  status: string;
  subtotal: string;
  serviceTax: string;
  discount: string;
  total: string;
  customerId: string;
  operatorId: string;
  openedAt: string;
  operator: {
    id: string;
    restaurantId: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  items: {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: string;
    notes: string[];
    createdAt: string;
    product: {
      id: string;
      restaurantId: string;
      code: string;
      name: string;
      category: string;
      price: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }[];
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



export interface ItemUpdate {
  id: string;
  quantity: number;
}

export interface CloseOrderResponse {
  message: string;
}

export interface OrdersHistorySalesResponse {
  date: string;
  vendas: number;
  faturamento: number;
}

export const ordersService = {
  async openOrders(): Promise<OpenOrdersResponse[]> {
    const { data } = await api.get<OpenOrdersResponse[]>("/orders/open");
    return data;
  },

  async closeOrder(
    id: string,
    method: string,
    customerId: string,
    subtotal: number,
    serviceTax: number,
    discount: number,
    amount: number,
  ): Promise<CloseOrderResponse> {
    const { data } = await api.patch<CloseOrderResponse>(
      `/orders/${id}/close`,
      {
        method,
        customerId,
        subtotal,
        serviceTax,
        discount,
        amount,
      },
    );

    return data;
  },

  async createOrder(payload: CreateOrderRequest): Promise<OpenOrdersResponse> {
    const { data } = await api.post<OpenOrdersResponse>("/orders", payload);
    return data;
  },

  async addItemsToOrder(
    orderId: string,
    payload: CreateOrderItem,
  ): Promise<OpenOrdersResponse> {
    const { data } = await api.post<OpenOrdersResponse>(
      `/orders/${orderId}/items`,
      payload,
    );
    return data;
  },

  async updateItems(orderId: string, items: ItemUpdate[]) {
    const { data } = await api.patch(`/orders/${orderId}`, {
      items: items,
    });
    return data;
  },

  async removeItem(itemId: string): Promise<void> {
    await api.delete(`/orders/${itemId}/items`);
  },

  async deleteOrder(orderId: string): Promise<void> {
    await api.delete(`/orders/${orderId}`);
  },

  async getOrdersHistorySales(): Promise<OrdersHistorySalesResponse[]> {
    const { data } = await api.get<OrdersHistorySalesResponse[]>(
      "/orders/daily-sales",
    );
    return data;
  },
};

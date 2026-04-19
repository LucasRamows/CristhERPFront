import api from "../api";

export interface OpenOrdersResponse {
  id: string;
  name: string;
  restaurantId: string;
  orderType: "TABLE" | "CARD" | "COUNTER" | "DELIVERY";
  reference: string;
  status: string;
  sale_date: string;
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

export interface DayOrdersResponse {
  id: string;
  orderType: string;
  reference: string;
  status: string;
  sale_date: string;
  subtotal: string;
  serviceTax: string;
  discount: string;
  total: string;
  openedAt: string;
  items: {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: string;
    notes: string[];
    product: {
      id: string;
      name: string;
      price: string;
    };
  }[];
  payments: {
    id: string;
    method: string;
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
  sale_date?: string;
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
    discountAmount: number,
    customerId?: string,
  ): Promise<CloseOrderResponse> {
    const { data } = await api.patch<CloseOrderResponse>(
      `/orders/${id}/close`,
      {
        method,
        discountAmount,
        customerId,
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

  async removeItem(orderId: string, itemId: string): Promise<void> {
    await api.delete(`/orders/${orderId}/items/${itemId}`);
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

  async getDayOrders(date: string): Promise<DayOrdersResponse[]> {
    const { data } = await api.get<DayOrdersResponse[]>(
      `/orders/day-orders?date=${date}`,
    );
    return data;
  },

  async getOrderById(id: string): Promise<DayOrdersResponse> {
    const { data } = await api.get<DayOrdersResponse>(`/orders/${id}`);
    return data;
  },
};

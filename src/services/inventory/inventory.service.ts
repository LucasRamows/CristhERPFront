import api from "../api";

export interface IngredientResponse {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStock: number;
}

export interface InventoryMovement {
  id: string;
  createdAt: string;
  quantity: number;
  type: "IN" | "OUT" | "BALANCE";
  price: number | null;
  reason?: string;
  supplier: {
    name: string;
    identification: string;
  };
}

export interface CreateIngredientRequest {
  name: string;
  unit: string;
  minStock: number;
  currentStock?: number;
}

export interface CreateInventoryEntryItem {
  ingredientId: string;
  quantity: number;
  unitPrice: number;
}

export interface InventoryEntryItemResponse extends CreateInventoryEntryItem {
  id: string;
  ingredient?: {
    name: string;
    unit: string;
  };
}

export interface InventoryEntryResponse {
  id: string;
  documentRef: string;
  date: string;
  restaurantId: string;
  supplierId: string;
  items: InventoryEntryItemResponse[];
  totalAmount: number;
  createdAt: string;
}

export interface CreateInventoryEntryRequest {
  documentRef: string;
  supplierId: string;
  date: string;
  totalAmount: number;
  items: CreateInventoryEntryItem[];
}

export const inventoryService = {
  async getIngredients(): Promise<IngredientResponse[]> {
    const { data } = await api.get<IngredientResponse[]>("/ingredients");
    return data;
  },
  async getIngredientHistory(id: string): Promise<InventoryMovement[]> {
    const { data } = await api.get<InventoryMovement[]>(
      `/ingredients/${id}/history`,
    );
    return data;
  },

  async createIngredient(
    ingredient: CreateIngredientRequest,
  ): Promise<IngredientResponse> {
    const { data } = await api.post<IngredientResponse>(
      "/ingredients",
      ingredient,
    );
    return data;
  },

  async createInventoryEntry(
    entry: CreateInventoryEntryRequest,
  ): Promise<InventoryEntryResponse> {
    const { data } = await api.post<InventoryEntryResponse>(
      "/inventory/entry",
      entry,
    );
    return data;
  },

  async balanceStock(
    id: string,
    delta: number,
  ): Promise<IngredientResponse> {
    const { data } = await api.put<IngredientResponse>(
      `/inventory/${id}/balance-stock`,
      { delta },
    );
    return data;
  }
};

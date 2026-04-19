// types/product.ts

// ─────────────────────────────────────────────────────────────
// TIPOS PRINCIPAIS DE PRODUTO
// ─────────────────────────────────────────────────────────────

export interface ProductsResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  categoryId: string;
  category: {
    id?: string;
    name: string;
  };

  unit: "UN" | "KG";
  price: number;
  status: boolean;

  imageUrl?: string;
  minStock?: number;

  // Estoque específico para Retail
  retailStock?: number;
  retailMinStock?: number;

  inventoryItemId?: string;

  createdAt?: string;
  updatedAt?: string;

  // Receitas / Composição (usado em produtos que não são Retail)
  productRecipes?: ProductRecipe[];
}

export interface ProductRecipe {
  id: string;
  productId: string;
  itemId: string;
  quantity: string; // vem como string do backend
  item: {
    id: string;
    name?: string;
    currentStock: string;
    minStock: string;
    unit?: string;
  };
}

// ─────────────────────────────────────────────────────────────
// TIPOS PARA CRIAÇÃO E UPLOAD
// ─────────────────────────────────────────────────────────────

export interface CreateProductRequest {
  code: string;
  name: string;
  description: string;
  categoryId: string;
  unit: "UN" | "KG";
  price: number;
  status: boolean;
  imageUrl?: string;
  minStock?: number;
}

export interface ProductsUpload extends Omit<CreateProductRequest, "minStock"> {
  createdAt?: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────────────────────
// TIPOS PARA PEDIDOS E OBSERVAÇÕES
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// TIPOS PARA ESTATÍSTICAS
// ─────────────────────────────────────────────────────────────

export interface ProductsStatsResponse {
  sales_date: string;
  quantity: number;
}

// ─────────────────────────────────────────────────────────────
// TIPOS AUXILIARES / FORMULÁRIO
// ─────────────────────────────────────────────────────────────

export interface IngredientFormItem {
  ingredientId: string;
  name: string;
  unit: string;
  quantity: number;        // número no formulário (diferente do backend)
}

// Tipo usado no formulário de edição/criação
export type MenuItemFormType = {
  name: string;
  price: number;
  categoryId: string;
  unit: "UN" | "KG";
  description?: string;
  code?: string;
  imageUrl?: string;
  minStock?: number;
  status: boolean;
  items: IngredientFormItem[];
};
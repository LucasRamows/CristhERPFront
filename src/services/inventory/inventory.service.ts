import api from "../api";

// 1. Interfaces Renomeadas (De Ingredient para Item)
export interface ItemResponse {
  id: string;
  name: string;
  code: string | null;
  unit: string;
  currentStock: number;
  minStock: number;
}

export interface InventoryEntryItemIngredient {
  id?: string;
  name?: string;
  unit?: string;
}

export interface InventoryEntryItemResponse {
  id: string;
  ingredientId: string;
  ingredient?: InventoryEntryItemIngredient;
  quantity: number;
  unitPrice: number;
}

export interface InventoryEntryResponse {
  id: string;
  date: string;
  documentRef: string;
  totalAmount: number;
  items: InventoryEntryItemResponse[];
}

export interface InventoryMovement {
  id: string;
  createdAt: string;
  supplier: {
    id: string;
    name: string;
  };
  quantity: number;
  type: "IN" | "OUT" | "ADJUST";
  price: number | null;
  reason?: string;
}

export interface CreateItemRequest {
  name: string;
  code?: string | null;
  unit: string;
  minStock: number;
  currentStock?: number;
  // Campos para criação simultânea de produto
  createProduct?: boolean;
  price?: number;
  categoryId?: string;
  description?: string;
  items?: Array<{ itemId: string; quantity: number }>;
}

// 2. A Interface que o Back-end DTO espera
export interface CreateEntryNotePayload {
  numero: string;
  serie: string;
  modelo: string;
  chaveNfe?: string;
  dataEmissao: string;

  totalProdutos: number;
  totalNota: number;
  frete: number;
  seguro: number;
  outrasDespesas: number;
  descontos: number;

  valorIpi?: number;
  baseIcms?: number;
  valorIcms?: number;
  baseIcmsSt?: number;
  valorIcmsSt?: number;

  supplier: {
    razaoSocial: string;
    cnpj: string;
    ie?: string;
    cidade?: string;
    uf?: string;
  };

  items: Array<{
    nomeOriginal: string;
    codigoProduto: string;
    quantidade: number;
    unidade: string;
    valorUnitario: number;
    valorTotal: number;
    valorIpi?: number;
    valorIcms?: number;
  }>;
}

export const inventoryService = {
  // --- ROTAS DE INSUMOS (ITEMS) ---

  async getItems(): Promise<ItemResponse[]> {
    const { data } = await api.get<ItemResponse[]>("/items");
    return data;
  },

  async getItemHistory(id: string): Promise<InventoryMovement[]> {
    const { data } = await api.get<InventoryMovement[]>(`/items/${id}/history`);
    return data;
  },

  async createItem(item: CreateItemRequest): Promise<ItemResponse> {
    const { data } = await api.post<ItemResponse>("/items", item);
    return data;
  },

  async balanceStock(id: string, delta: number): Promise<ItemResponse> {
    const { data } = await api.put<ItemResponse>(
      `/inventory/${id}/balance-stock`,
      {
        delta,
      },
    );
    return data;
  },

  async updateItem(
    id: string,
    item: Partial<CreateItemRequest>,
  ): Promise<ItemResponse> {
    const { data } = await api.put<ItemResponse>(`/items/${id}`, item);
    return data;
  },

  // --- ROTAS DE NOTA FISCAL (ENTRY NOTES) ---

  // Essa é a função que o seu Form do React vai chamar!
  // Ela pega a bagunça do estado do React e formata perfeito para o NestJS
  async saveEntryNote(formState: any, totalsState: any): Promise<any> {
    // Formata o Payload exatamente como o DTO do Back-end exige
    const payload: CreateEntryNotePayload = {
      numero: formState.numero,
      serie: formState.serie,
      modelo: formState.modelo,
      chaveNfe: formState.chaveNfe,
      dataEmissao: formState.dataEmissao,

      // Achata os totais na raiz do objeto
      totalProdutos: totalsState.totalProdutos,
      totalNota: totalsState.totalNota,
      frete: formState.frete || 0,
      seguro: formState.seguro || 0,
      outrasDespesas: formState.outrasDespesas || 0,
      descontos: formState.descontos || 0,

      valorIpi: totalsState.valorIpi || 0,
      baseIcms: totalsState.baseIcms || 0,
      valorIcms: totalsState.valorIcms || 0,
      baseIcmsSt: totalsState.baseIcmsSt || 0,
      valorIcmsSt: totalsState.valorIcmsSt || 0,

      supplier: {
        razaoSocial: formState.supplier.razaoSocial,
        cnpj: formState.supplier.cnpj,
        ie: formState.supplier.ie,
        cidade: formState.supplier.cidade,
        uf: formState.supplier.uf,
      },

      // Mapeia os itens do front para os nomes que o DTO do back exige
      items: formState.items.map((item: any) => ({
        nomeOriginal: item.nome,
        codigoProduto: item.codigoProduto || "SEM_CODIGO",
        quantidade: Number(item.quantidade),
        unidade: item.unidade || "UN",
        valorUnitario: Number(item.valorUnitario),
        valorTotal: Number(item.quantidade) * Number(item.valorUnitario),
        valorIpi: Number(item.valorIpi) || 0,
        valorIcms: Number(item.valorIcms) || 0,
      })),
    };

    // A Rota do controller que criamos chama-se 'inventory-entries'
    const { data } = await api.post("/entry", payload);
    return data;
  },
};

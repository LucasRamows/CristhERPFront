// src/_features/inventory/hooks/useInventoryUI.ts
import { useState, useCallback } from "react";
import type { ProductsResponse } from "../../../../services/products/products.types";
import type { ItemResponse } from "../../../../services/inventory/inventory.service";

/**
 * Define as abas principais do módulo de estoque/produtos
 */
export type ActiveView = "products" | "inventory" | "entry-notes";

export function useInventoryUI() {
  // 1. Controle de Navegação (Abas)
  const [activeView, setActiveView] = useState<ActiveView>("products");

  // 2. Controle de Foco (Itens em Edição ou Detalhes)
  // Substituímos 'selectedProduct' por 'activeProduct' para manter o padrão 'active' do sistema
  const [activeProduct, setActiveProduct] = useState<ProductsResponse | null>(null);
  
  // Substituímos 'selectedInventoryItem' por 'activeInventoryItem'
  const [activeInventoryItem, setActiveInventoryItem] = useState<ItemResponse | null>(null);

  /**
   * Helper para limpar o estado de seleção
   */
  const clearSelection = useCallback(() => {
    setActiveProduct(null);
    setActiveInventoryItem(null);
  }, []);

  return {
    // Abas
    activeView,
    setActiveView,

    // Itens Ativos (Foco)
    activeProduct,
    setActiveProduct,
    activeInventoryItem,
    setActiveInventoryItem,

    // Helpers
    clearSelection,
  };
}
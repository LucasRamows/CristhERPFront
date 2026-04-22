// src/_features/inventory/hooks/InventoryContext.tsx
import { createContext, useContext, useEffect, type PropsWithChildren } from "react";

import { useInventoryData } from "./useInventoryData";
import { useInventoryUI } from "./useInventoryUI";
import { useInventoryActions } from "./useInventoryActions";
import { useAuthenticatedUser } from "../../../../contexts/DataContext";

// Tipagem do Contexto (soma de todos os retornos)
type InventoryContextValue = ReturnType<typeof useInventoryData> &
                             ReturnType<typeof useInventoryUI> &
                             ReturnType<typeof useInventoryActions> & 
                             { isRetail: boolean }; // Adicionamos essa helper flag

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: PropsWithChildren) {
  // 1. Contexto Global de Usuário
  const { businessType } = useAuthenticatedUser();
  const isRetail = businessType === "RETAIL";

  // 2. Os Três Pilares
  const data = useInventoryData();
  const ui = useInventoryUI();
  
  const actions = useInventoryActions({
    setProducts: data.setProducts,
    setInventoryItems: data.setInventoryItems,
    fetchProducts: data.fetchProducts,
    fetchInventory: data.fetchInventory,
    isRetail,
  });

  // 3. Ciclo de Vida: Busca inicial inteligente
  useEffect(() => {
    data.fetchProducts();
  }, [data.fetchProducts]);

  useEffect(() => {
    // Só busca inventário se a aba for acessada e estiver vazia
    if (ui.activeView === "inventory" && data.inventoryItems.length === 0) {
      data.fetchInventory();
    }
  }, [ui.activeView, data.inventoryItems.length, data.fetchInventory]);

  return (
    <InventoryContext.Provider value={{ ...data, ...ui, ...actions, isRetail }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventoryContext() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventoryContext deve ser usado dentro do InventoryProvider");
  }
  return context;
}
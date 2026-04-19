// PDVUIContext.tsx — UI-only context for the PDV module.
// Handles view navigation, sheet/modal visibility, and selected product.
// Kept separate so UI interactions (open sheet, change view) do NOT
// trigger re-renders in heavy business data consumers.

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { PDVUIContextType, PDVView } from "./pdv.types";
import type { ProductsResponse } from "../../../services/products/products.types";

// ==================== CONTEXT ====================

export const PDVUIContext = createContext<PDVUIContextType | undefined>(
  undefined,
);

// ==================== PROVIDER ====================

interface PDVUIProviderProps {
  children: ReactNode;
}

export function PDVUIProvider({ children }: PDVUIProviderProps) {
  const [activeView, setActiveView] = useState<PDVView>("tables");
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductsResponse | null>(null);

  const value: PDVUIContextType = {
    activeView,
    setActiveView,
    isCartSheetOpen,
    setIsCartSheetOpen,
    selectedProduct,
    setSelectedProduct,
  };

  return (
    <PDVUIContext.Provider value={value}>{children}</PDVUIContext.Provider>
  );
}

// ==================== CONSUMER HOOK ====================

export function usePDVUI(): PDVUIContextType {
  const context = useContext(PDVUIContext);
  if (!context) {
    throw new Error("usePDVUI must be used inside PDVProvider");
  }
  return context;
}

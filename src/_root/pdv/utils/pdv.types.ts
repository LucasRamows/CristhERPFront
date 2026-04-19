// pdv.types.ts — Pure TypeScript interfaces for the PDV module.
// No React imports here. Only data shapes and context type contracts.

import type { OpenOrdersResponse } from "../../../services/orders/orders.service";
import type { PdvEntity } from "../../types/PdvEntity";
import type { ProductsResponse } from "../../../services/products/products.types";

// ==================== PRIMITIVE TYPES ====================

export type PDVView =
  | "tables"
  | "menu"
  | "comandas"
  | "caixa_rapido"
  | "payment";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  obs: string[];
  uniqueId?: string;
  isFromBackend?: boolean;
  isScale?: boolean;
}

export interface PaymentData {
  method: string;
  discount: number;
  customerId?: string;
}

// ==================== CONTEXT CONTRACT TYPES ====================

/**
 * Business context — data, cart, and all actions.
 * Changes whenever backend data or activeEntity changes.
 */
export interface PDVBusinessContextType {
  // === ENTITY STATE ===
  activeEntity: PdvEntity | null;
  setActiveEntity: React.Dispatch<React.SetStateAction<PdvEntity | null>>;

  // === DATA ===
  openOrders: PdvEntity[];
  tables: PdvEntity[];
  comandas: PdvEntity[];
  products: ProductsResponse[];
  isLoadingProducts: boolean;

  // === CART ===
  cart: CartItem[];
  subtotal: number;
  serviceTax: number;
  total: number;
  includeService: boolean;
  setIncludeService: React.Dispatch<React.SetStateAction<boolean>>;

  // === ENTITY ACTIONS ===
  handleEntityClick: (entity: PdvEntity) => void;
  handleAddClick: (entity: PdvEntity) => void;
  handleCaixaRapido: () => void;
  handleCreateComanda: (reference: string) => Promise<void>;

  // === CART ACTIONS ===
  confirmAddToCart: (item: any, options?: { saleDate?: Date }) => Promise<void>;
  updateQuantity: (
    uniqueId: string,
    delta: number,
    isFromBackend: boolean,
  ) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => void;

  // === PAYMENT ACTIONS ===
  handleConfirmPayment: (data: PaymentData) => Promise<void>;

  // === SYNC STATE ===
  isSyncing: boolean;
  isLoading: boolean;
  refreshData: () => void;
  updateOrderInState: (response: OpenOrdersResponse) => void;
}

/**
 * UI context — view navigation and sheet/modal visibility.
 * Changes on every navigation/open/close — isolated to avoid
 * re-rendering heavy business consumers.
 */
export interface PDVUIContextType {
  activeView: PDVView;
  setActiveView: React.Dispatch<React.SetStateAction<PDVView>>;
  isCartSheetOpen: boolean;
  setIsCartSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: ProductsResponse | null;
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<ProductsResponse | null>
  >;
}

/**
 * Combined type — used by usePDV() for backward-compat consumers
 * that haven't been migrated to the split hooks yet.
 */
export type PDVContextType = PDVBusinessContextType & PDVUIContextType;

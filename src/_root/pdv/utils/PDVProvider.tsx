// PDVProvider.tsx
// Orchestrates the two PDV contexts:
//   - PDVUIContext  (view, sheet visibility, selectedProduct) — defined in PDVUIContext.tsx
//   - PDVBusinessContext (orders, cart, entities, all actions) — defined internally here
//
// Nesting: PDVUIProvider (outer) → PDVBusinessProvider (inner)
// This ensures PDVBusinessProvider can call usePDVUI() to get setActiveView / setIsCartSheetOpen.

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuthenticatedUser } from "../../../contexts/DataContext";
import { calcPdvTotals } from "../../../services/math/pdv.service";
import { ordersService } from "../../../services/orders/orders.service";
import { productsService } from "../../../services/products/products.service";
import type { ProductsResponse } from "../../../services/products/products.types";
import type { PdvEntity } from "../../types/PdvEntity";
import { PDVUIProvider, usePDVUI } from "./PDVUIContext";
import type {
  CartItem,
  PDVBusinessContextType,
  PDVContextType,
} from "./pdv.types";
import { usePdvActions } from "./usePDVActions";
import { usePDVEntityData } from "./usePDVEntityData";

// ==================== BUSINESS CONTEXT ====================

export const PDVBusinessContext = createContext<
  PDVBusinessContextType | undefined
>(undefined);

// ==================== INNER PROVIDER ====================
// Rendered inside PDVUIProvider so it can safely call usePDVUI().

function PDVBusinessProvider({ children }: { children: ReactNode }) {
  const { data: user, totalTables, businessType } = useAuthenticatedUser();
  const queryClient = useQueryClient();

  // UI setters consumed from the outer PDVUIContext
  const { setActiveView, setIsCartSheetOpen } = usePDVUI();

  // ==================== BUSINESS STATE ====================

  const [activeEntity, setActiveEntity] = useState<PdvEntity | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [includeService, setIncludeService] = useState(true);

  /**
   * activeEntityRef always holds the current activeEntity value.
   * Action callbacks read from this ref so they never form stale closures —
   * eliminating the cascade of useCallback re-creations every time an item
   * is added (which previously changed activeEntity.items).
   */
  const activeEntityRef = useRef<PdvEntity | null>(null);
  useEffect(() => {
    activeEntityRef.current = activeEntity;
  }, [activeEntity]);

  // ==================== TANSTACK QUERY ====================

  /**
   * openOrders query — replaces the manual fetchCacheRef / CACHE_DURATION_MS pattern.
   * TanStack Query handles staleness, deduplication, background sync and
   * refetchOnWindowFocus for free.
   */
  const { data: queryOpenOrders, isLoading: isQueryLoading } = useQuery({
    queryKey: ["pdv", "openOrders"],
    queryFn: ordersService.openOrders,
    staleTime: 5_000,
    refetchOnWindowFocus: true,
  });

  const {
    data: products = [] as ProductsResponse[],
    isLoading: isLoadingProducts,
  } = useQuery<ProductsResponse[]>({
    queryKey: ["pdv", "products"],
    queryFn: productsService.getProductsActive,
    staleTime: 60_000,
  });

  /**
   * Local openOrders state for optimistic patching via syncOrder.
   * Gets updated whenever the query fetches fresh data from the backend.
   * syncOrder patches it directly for immediate UI feedback.
   */
  const [openOrders, setOpenOrders] = useState<PdvEntity[]>([]);

  useEffect(() => {
    if (queryOpenOrders !== undefined) {
      setOpenOrders(queryOpenOrders as unknown as PdvEntity[]);
    }
  }, [queryOpenOrders]);

  /**
   * refreshData — invalidates the openOrders query, triggering a background
   * refetch. Replaces the old refreshData(skipCache) pattern entirely.
   */
  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["pdv", "openOrders"] });
  }, [queryClient]);

  // ==================== DERIVED DATA ====================

  const { tables, comandas } = usePDVEntityData(totalTables, openOrders);

  const isLoading = isQueryLoading && openOrders.length === 0;
  const isCounterOnly = businessType !== "FOOD_AND_BEVERAGE";

  // ==================== CART ====================

  /**
   * cart — source of truth is openOrders (synced via syncOrder after each operation).
   * Draft localStorage state has been removed — all items go through the backend.
   */
  const cart = useMemo<CartItem[]>(() => {
    if (!activeEntity) return [];

    const isScaleNote = (notes: string[] = []): boolean =>
      notes.some((n) => /kg$/i.test(n.trim()));

    const sourceItems =
      activeEntity.id &&
      !String(activeEntity.id).startsWith("mesa_") &&
      !String(activeEntity.id).startsWith("temp_") &&
      activeEntity.id !== "caixa_balcao"
        ? openOrders.find((o) => o.id === activeEntity.id)?.items ??
          activeEntity.items ??
          []
        : activeEntity.items ?? [];

    return sourceItems.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      name: item.product?.name || "Produto",
      price: parseFloat(item.unitPrice || 0),
      quantity: item.quantity,
      obs: item.notes || [],
      isFromBackend: true,
      isScale: isScaleNote(item.notes),
    }));
  }, [activeEntity, openOrders]);

  const { subtotal, serviceTax, total } = useMemo(
    () =>
      calcPdvTotals(
        cart,
        includeService,
        activeEntity?.orderType === "COUNTER",
      ),
    [cart, includeService, activeEntity],
  );

  // ==================== ACTIONS ====================

  const PdvActions = usePdvActions({
    activeEntityRef,
    setActiveEntity,
    setOpenOrders,
    setIsSyncing,
    setActiveView,
    setIsCartSheetOpen,
    comandas,
    operatorId: user?.id || "",
  });

  // ==================== EFFECTS ====================

  // Auto-open caixa rápido for counter-only businesses
  useEffect(() => {
    if (isCounterOnly && !activeEntity && !isLoading) {
      PdvActions.handleCaixaRapido();
    }
    // PdvActions is stable (memoized inside), so this is safe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCounterOnly, activeEntity, isLoading]);

  // Keep activeEntity in sync when openOrders updates
  // (e.g. after a background refetch, placeholder → real id)
  useEffect(() => {
    if (
      !activeEntity ||
      !activeEntity.id ||
      String(activeEntity.id).startsWith("temp_") ||
      String(activeEntity.id).startsWith("mesa_") ||
      activeEntity.id === "caixa_balcao"
    )
      return;

    const allEntities = [...tables, ...comandas];
    const updated = allEntities.find(
      (e) =>
        e.id === activeEntity.id ||
        (e.reference === activeEntity.reference &&
          e.orderType === activeEntity.orderType),
    );

    if (updated && updated.id !== activeEntity.id) {
      setActiveEntity(updated);
    }
  }, [openOrders, tables, comandas]);

  // ==================== CONTEXT VALUE ====================

  const value: PDVBusinessContextType = {
    // Entity
    activeEntity,
    setActiveEntity,

    // Data
    openOrders,
    tables,
    comandas,
    products,
    isLoadingProducts,

    // Cart
    cart,
    subtotal,
    serviceTax,
    total,
    includeService,
    setIncludeService,

    // Entity actions
    handleEntityClick: PdvActions.handleEntityClick,
    handleAddClick: PdvActions.handleAddClick,
    handleCaixaRapido: PdvActions.handleCaixaRapido,
    handleCreateComanda: PdvActions.handleCreateComanda,

    // Cart actions
    confirmAddToCart: PdvActions.confirmAddToCart,
    updateQuantity: PdvActions.updateQuantity,
    removeFromCart: PdvActions.removeFromCart,
    clearCart: PdvActions.clearCart,

    // Payment
    handleConfirmPayment: PdvActions.handleConfirmPayment,

    // Sync state
    isSyncing,
    isLoading,
    refreshData,
    updateOrderInState: PdvActions.updateOrderInState,
  };

  return (
    <PDVBusinessContext.Provider value={value}>
      {children}
    </PDVBusinessContext.Provider>
  );
}

// ==================== EXPORTED COMPOSITE PROVIDER ====================

interface PDVProviderProps {
  children: ReactNode;
}

/**
 * PDVProvider — composes PDVUIProvider (outer) and PDVBusinessProvider (inner).
 * Outer-first ensures the business provider can consume the UI context.
 * This is the only export consumers need to render.
 */
export function PDVProvider({ children }: PDVProviderProps) {
  return (
    <PDVUIProvider>
      <PDVBusinessProvider>{children}</PDVBusinessProvider>
    </PDVUIProvider>
  );
}

// ==================== CONSUMER HOOKS ====================

/**
 * usePDVBusiness — access business data and all actions.
 * Re-renders when orders, cart, or entity state changes.
 */
export function usePDVBusiness(): PDVBusinessContextType {
  const context = useContext(PDVBusinessContext);
  if (!context) {
    throw new Error("usePDVBusiness must be used inside PDVProvider");
  }
  return context;
}

/**
 * usePDV — merged backward-compat hook combining business + UI contexts.
 * Existing consumers that import usePDV() continue to work unchanged.
 * Over time, components can be migrated to usePDVBusiness() / usePDVUI()
 * for finer-grained re-render control.
 */
export function usePDV(): PDVContextType {
  return { ...usePDVBusiness(), ...usePDVUI() };
}

// ==================== RE-EXPORTS ====================
// Centralise all PDV public API under this single module entry point.

export { PDVUIContext, usePDVUI } from "./PDVUIContext";
export type {
  CartItem,
  PDVBusinessContextType,
  PDVContextType,
  PDVView,
  PaymentData,
} from "./pdv.types";

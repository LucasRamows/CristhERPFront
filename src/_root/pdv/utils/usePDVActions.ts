// usePDVActions.ts — All PDV action callbacks.
// Uses activeEntityRef (instead of activeEntity in deps) to avoid stale closure
// re-renders. Uses queryClient.invalidateQueries to trigger data refresh instead
// of a manual fetchOrders() callback.

import { useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PdvEntity } from "../../types/PdvEntity";
import type { PaymentData, PDVView } from "./pdv.types";
import {
  ordersService,
  type OpenOrdersResponse,
} from "../../../services/orders/orders.service";
import { mapOrderToPdvEntity } from "../../../lib/utils";

// ==================== TYPES ====================

interface UsePdvActionsParams {
  activeEntityRef: React.RefObject<PdvEntity | null>;
  setActiveEntity: React.Dispatch<React.SetStateAction<PdvEntity | null>>;
  setOpenOrders: React.Dispatch<React.SetStateAction<PdvEntity[]>>;
  setIsSyncing: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveView: React.Dispatch<React.SetStateAction<PDVView>>;
  setIsCartSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  comandas: PdvEntity[];
  operatorId: string;
}

interface ConfirmAddToCartOptions {
  saleDate?: Date;
}

// ==================== HOOK ====================

export const usePdvActions = ({
  activeEntityRef,
  setActiveEntity,
  setOpenOrders,
  setIsSyncing,
  setActiveView,
  setIsCartSheetOpen,
  comandas,
  operatorId,
}: UsePdvActionsParams) => {
  const queryClient = useQueryClient();

  // Controls duplicate in-flight requests
  const pendingRequests = useRef<Set<string>>(new Set());

  // ==================== HELPERS ====================

  const isRequestPending = useCallback((key: string) => {
    return pendingRequests.current.has(key);
  }, []);

  const addPendingRequest = useCallback((key: string) => {
    pendingRequests.current.add(key);
  }, []);

  const removePendingRequest = useCallback((key: string) => {
    pendingRequests.current.delete(key);
  }, []);

  /**
   * invalidateOrders — triggers a background refetch of the openOrders query.
   * Replaces the old fetchOrders() callback pattern.
   */
  const invalidateOrders = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["pdv", "openOrders"] });
  }, [queryClient]);

  /**
   * syncOrder — surgical local update after any backend response that returns the
   * full order object. Updates openOrders list AND patches activeEntity in place
   * to prevent stale state without triggering a full fetch.
   */
  const syncOrder = useCallback(
    (apiResponse: OpenOrdersResponse) => {
      const entity = mapOrderToPdvEntity(apiResponse);

      setOpenOrders((prev) => {
        const filtered = prev.filter((o) => o.id !== entity.id);
        return [...filtered, entity];
      });

      // Use ref so this never becomes stale even after many item additions
      if (activeEntityRef.current?.id === entity.id) {
        setActiveEntity((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            total: entity.total,
            subtotal: entity.subtotal,
            discount: entity.discount,
            serviceTax: entity.serviceTax,
            items: entity.items,
            status: entity.status,
          };
        });
      }
    },
    // activeEntityRef is a ref — stable reference, not a dep. setters are stable.
    [activeEntityRef, setOpenOrders, setActiveEntity],
  );

  const updateOrderInState = useCallback(
    (apiResponse: OpenOrdersResponse) => {
      syncOrder(apiResponse);
    },
    [syncOrder],
  );

  const openEntity = useCallback(
    (entity: PdvEntity, view: "tables" | "menu" = "tables") => {
      setActiveEntity(entity);

      if (view === "menu") {
        setActiveView("menu");
        setIsCartSheetOpen(false);
      } else {
        setIsCartSheetOpen(true);
      }
    },
    [setActiveEntity, setActiveView, setIsCartSheetOpen],
  );

  // ==================== NAVIGATION ACTIONS ====================

  const handleEntityClick = useCallback(
    (entity: PdvEntity) => {
      openEntity(entity);
    },
    [openEntity],
  );

  const handleAddClick = useCallback(
    (entity: PdvEntity) => {
      openEntity(entity, "menu");
    },
    [openEntity],
  );

  const handleCaixaRapido = useCallback(() => {
    const caixaVirtual: PdvEntity = {
      id: "caixa_balcao",
      name: "CAIXA RÁPIDO",
      orderType: "COUNTER",
      reference: "BALCÃO",
      label: "CAIXA RÁPIDO",
      status: "open",
      total: 0,
      subtotal: 0,
      discount: 0,
      serviceTax: 0,
      items: [],
    };
    openEntity(caixaVirtual, "menu");
  }, [openEntity]);

  // ==================== COMANDA ACTIONS ====================

  const handleCreateComanda = useCallback(
    async (reference: string) => {
      const cleanRef = reference.trim();

      if (!cleanRef) {
        toast.error("Número da comanda é obrigatório.");
        return;
      }

      const existing = comandas.find((c) => c.reference === cleanRef);
      if (existing) {
        toast.info(`Comanda ${cleanRef} já está aberta.`);
        handleEntityClick(existing);
        return;
      }

      const requestKey = `create_comanda_${cleanRef}`;
      if (isRequestPending(requestKey)) {
        toast.info("Requisição em andamento...");
        return;
      }

      try {
        addPendingRequest(requestKey);
        setIsSyncing(true);

        const response = await ordersService.createOrder({
          orderType: "CARD",
          reference: cleanRef,
          operatorId: operatorId || "",
          sale_date: new Date().toISOString(),
          items: [],
        });

        invalidateOrders();
        const newEntity = mapOrderToPdvEntity(response);
        openEntity(newEntity, "menu");

        toast.success(`Comanda ${cleanRef} aberta com sucesso.`);
      } catch (error: any) {
        console.error("Erro ao criar comanda:", error);
        const message =
          error.response?.data?.message || "Erro ao conectar com o servidor.";
        toast.error(`Não foi possível abrir a comanda: ${message}`);
      } finally {
        removePendingRequest(requestKey);
        setIsSyncing(false);
      }
    },
    [
      comandas,
      operatorId,
      isRequestPending,
      addPendingRequest,
      removePendingRequest,
      invalidateOrders,
      openEntity,
      setIsSyncing,
      handleEntityClick,
    ],
  );

  // ==================== CART ACTIONS ====================

  /**
   * updateQuantity — bifurcates between backend items and local placeholders.
   * For backend items: calls the API and uses syncOrder for local update.
   * For removal (qty <= 0): calls removeItem then invalidates (no response body).
   */
  const updateQuantity = useCallback(
    async (uniqueId: string, delta: number, isFromBackend: boolean) => {
      // Read from ref — always current, no stale closure
      const activeEntity = activeEntityRef.current;

      if (!activeEntity) {
        toast.error("Nenhuma entidade selecionada.");
        return;
      }

      setIsSyncing(true);

      try {
        if (isFromBackend) {
          const item = activeEntity.items?.find((i: any) => i.id === uniqueId);
          if (!item) {
            toast.error("Item não encontrado.");
            return;
          }

          const newQty = Number(item.quantity) + delta;

          if (newQty <= 0) {
            await ordersService.removeItem(activeEntity.id, uniqueId);
            // Wait for cache invalidation/refetch to complete
            await invalidateOrders();
          } else {
            const response = await ordersService.updateItems(activeEntity.id, [
              { id: uniqueId, quantity: newQty },
            ]);
            syncOrder(response);
          }
        }
        // Note: local draft items (isFromBackend=false) are no longer supported —
        // the orders draft state was removed. All items go through the backend.
      } catch (error: any) {
        console.error("Erro ao atualizar quantidade:", error);
        const message =
          error.response?.data?.message || "Erro ao atualizar quantidade.";
        toast.error(message);
        // On failure force a fresh fetch to restore consistent state
        await invalidateOrders();
      } finally {
        setIsSyncing(false);
      }
    },
    // Only stable refs/setters in deps — no activeEntity object
    [activeEntityRef, invalidateOrders, syncOrder, setIsSyncing],
  );

  /**
   * confirmAddToCart — adds a product to the active order.
   * - If product already exists: increments via updateQuantity
   * - If entity is a placeholder: creates order in backend first
   * - If order exists: adds item via addItemsToOrder
   * Uses syncOrder after each successful operation.
   */
  const confirmAddToCart = useCallback(
    async (item: any, options?: ConfirmAddToCartOptions) => {
      const activeEntity = activeEntityRef.current;

      if (!activeEntity) {
        toast.error("Nenhuma entidade selecionada.");
        return;
      }

      const createOrderItem = {
        productId: item.id,
        uniqueId: `local_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 5)}`,
        name: item.name,
        quantity: Number(item.quantity) || 1,
        unitPrice: Number(item.price),
        notes: item.obs || [],
        total: Number(item.price) * (Number(item.quantity) || 1),
      };

      // If product already exists in the active order — increment quantity
      const existingItems = activeEntity.items || [];
      const existingItem = existingItems.find(
        (i: any) => i.product?.id === item.id,
      );

      if (existingItem) {
        const uniqueId = existingItem.id || existingItem.uniqueId || item.id;
        const isFromBackend =
          !!existingItem.id &&
          !String(existingItem.id).startsWith("temp_") &&
          existingItem.id !== "caixa_balcao";

        await updateQuantity(
          uniqueId,
          Number(item.quantity) || 1,
          isFromBackend,
        );
        setIsCartSheetOpen(true);
        return;
      }

      try {
        setIsSyncing(true);

        const isPlaceholderId =
          String(activeEntity.id).startsWith("mesa_") ||
          String(activeEntity.id).startsWith("temp_") ||
          activeEntity.id === "caixa_balcao";

        if (isPlaceholderId) {
          const saleDateISO =
            options?.saleDate?.toISOString() || new Date().toISOString();

          const response = await ordersService.createOrder({
            orderType: activeEntity.orderType || "COUNTER",
            reference: activeEntity.reference || "BALCÃO",
            operatorId: operatorId || "",
            sale_date: saleDateISO,
            items: [
              {
                productId: createOrderItem.productId,
                quantity: createOrderItem.quantity,
                unitPrice: createOrderItem.unitPrice,
                notes: createOrderItem.notes,
              },
            ],
          });

          // Sync the response optimistically, then background-refetch
          syncOrder(response);
          invalidateOrders();

          const mappedEntity = mapOrderToPdvEntity(response);
          setActiveEntity(mappedEntity);

          const entityType =
            activeEntity.orderType === "TABLE" ? "Mesa" : "Comanda";
          toast.success(`${entityType} aberta com sucesso!`);
        } else {
          // Order already exists — add item
          const response = await ordersService.addItemsToOrder(
            activeEntity.id,
            createOrderItem,
          );
          syncOrder(response);
          toast.success(`${item.name} adicionado com sucesso!`);
        }

        setIsCartSheetOpen(true);
      } catch (error: any) {
        console.error("Erro ao processar item:", error);
        const message =
          error.response?.data?.message || "Erro ao conectar com o servidor.";
        toast.error(`Falha ao adicionar item: ${message}`);
      } finally {
        setIsSyncing(false);
      }
    },
    // No activeEntity in deps — read via ref
    [
      activeEntityRef,
      operatorId,
      invalidateOrders,
      syncOrder,
      setActiveEntity,
      setIsCartSheetOpen,
      setIsSyncing,
      updateQuantity,
    ],
  );

  const removeFromCart = useCallback(
    async (uniqueId: string) => {
      const activeEntity = activeEntityRef.current;
      if (!activeEntity) return;

      const item = activeEntity.items?.find((i: any) => i.id === uniqueId);
      if (!item) return;

      const isFromBackend = !!item.id && !String(item.id).startsWith("temp_");
      await updateQuantity(uniqueId, -999, isFromBackend);
    },
    [activeEntityRef, updateQuantity],
  );

  const clearCart = useCallback(() => {
    // With draft state removed, clearCart is a no-op.
    // Backend items are removed individually via removeFromCart.
    // Kept in the API for compatibility with CartSheet usage.
  }, []);

  // ==================== PAYMENT ACTIONS ====================

  const handleConfirmPayment = useCallback(
    async (data: PaymentData) => {
      const activeEntity = activeEntityRef.current;

      if (!activeEntity?.id) {
        toast.error("Nenhuma entidade selecionada para fechamento.");
        return;
      }

      if (activeEntity.id.startsWith("temp_")) {
        toast.error("Não é possível fechar um pedido temporário.");
        return;
      }

      const requestKey = `close_order_${activeEntity.id}`;
      if (isRequestPending(requestKey)) {
        toast.info("Fechamento em andamento...");
        return;
      }

      try {
        addPendingRequest(requestKey);
        setIsSyncing(true);

        await ordersService.closeOrder(
          activeEntity.id,
          data.method,
          data.discount,
          data.customerId || undefined,
        );

        // Remove from local state immediately, then background sync
        setOpenOrders((prev) => prev.filter((o) => o.id !== activeEntity.id));
        invalidateOrders();

        setActiveEntity(null);

        const targetView =
          activeEntity.orderType === "CARD" ? "comandas" : "tables";
        setActiveView(targetView);
        setIsCartSheetOpen(false);

        toast.success("Pedido finalizado com sucesso!");
      } catch (error: any) {
        console.error("Erro ao finalizar pagamento:", error);
        const message =
          error.response?.data?.message || "Erro ao conectar com o servidor.";
        toast.error(`Não foi possível finalizar: ${message}`);
      } finally {
        removePendingRequest(requestKey);
        setIsSyncing(false);
      }
    },
    [
      activeEntityRef,
      isRequestPending,
      addPendingRequest,
      removePendingRequest,
      setOpenOrders,
      invalidateOrders,
      setActiveEntity,
      setActiveView,
      setIsCartSheetOpen,
      setIsSyncing,
    ],
  );

  // ==================== RETURN ====================

  return {
    handleEntityClick,
    handleAddClick,
    handleCaixaRapido,
    handleCreateComanda,
    confirmAddToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    handleConfirmPayment,
    updateOrderInState,
  };
};

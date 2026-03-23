import { useCallback } from "react";
import { toast } from "sonner";
import type { PdvEntity } from "../_root/types/PdvEntity";
import { ordersService } from "../services/orders/orders.service";

export const usePdvActions = (
  activeEntity: PdvEntity | null,
  setActiveEntity: React.Dispatch<React.SetStateAction<PdvEntity | null>>,
  setOrders: React.Dispatch<React.SetStateAction<Record<string, any[]>>>,
  setOpenOrders: React.Dispatch<React.SetStateAction<any[]>>,
  setIsSyncing: React.Dispatch<React.SetStateAction<boolean>>,
  setActiveView: React.Dispatch<React.SetStateAction<string>>,
  setCartMobileOpen: React.Dispatch<React.SetStateAction<boolean>>,
  fetchOrders: () => Promise<void>,
  comandas: PdvEntity[],
  operatorId: string,
) => {
  // --- 1. FUNÇÕES AUXILIARES (PRIVADAS) ---

  const updateOrderInState = useCallback(
    (updatedOrder: any) => {
      setOpenOrders((prev) => {
        const otherOrders = prev.filter((o) => o.id !== updatedOrder.id);
        return [...otherOrders, updatedOrder];
      });
    },
    [setOpenOrders],
  );

  const openEntity = useCallback(
    (entity: PdvEntity, view: "tables" | "menu" = "tables") => {
      setActiveEntity(entity);

      // Inicializa o array de itens locais se não existir
      setOrders((prev) => {
        if (prev[entity.id]) return prev;
        return { ...prev, [entity.id]: [] };
      });

      if (view === "menu") {
        setActiveView("menu");
        setCartMobileOpen(false);
      } else {
        setCartMobileOpen(true);
      }
    },
    [setActiveEntity, setOrders, setActiveView, setCartMobileOpen],
  );

  // --- 2. AÇÕES DE NAVEGAÇÃO E SELEÇÃO ---

  const handleEntityClick = (entity: PdvEntity) => openEntity(entity);

  const handleAddClick = (entity: any) => openEntity(entity, "menu");

  const handleCaixaRapido = () => {
    const caixaVirtual: PdvEntity = {
      id: "caixa_balcao",
      name: "CAIXA RÁPIDO",
      orderType: "COUNTER",
      reference: "BALCÃO",
      label: "CAIXA RÁPIDO",
      status: "open",
      total: 0,
      items: [],
    };
    openEntity(caixaVirtual, "menu");
  };

  const handleCreateComanda = async (reference: string) => {
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

    try {
      setIsSyncing(true);
      const response = await ordersService.createOrder({
        orderType: "CARD",
        reference: cleanRef,
        operatorId: operatorId || "",
        total: 0,
        items: [],
      });

      // 3. Sucesso: Sincroniza estado global e abre a entidade
      await fetchOrders();

      const newEntity: PdvEntity = {
        id: response.id,
        orderType: "CARD",
        name: `COMANDA ${cleanRef}`,
        reference: cleanRef,
        label: `CMD ${cleanRef}`,
        status: "open",
        total: 0,
        items: [],
      };

      openEntity(newEntity, "menu");
      toast.success(`Comanda ${cleanRef} aberta com sucesso.`);
    } catch (error: any) {
      console.error("Erro ao criar comanda:", error);

      const message =
        error.response?.data?.message || "Erro ao conectar com o servidor.";
      toast.error(`Não foi possível abrir a comanda: ${message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // --- 3. AÇÕES DE CARRINHO E BACKEND ---

  const confirmAddToCart = async (item: any) => {
    if (!activeEntity) return;
    console.log("item", item);
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

    const existingItems = activeEntity.items || [];
    console.log("aqui", existingItems);
    const existingItem = existingItems.find(
      (i: any) => i.product.id === item.id,
    );

    if (existingItem) {
      const uniqueId = existingItem.id || existingItem.uniqueId || item.id;
      const isFromBackend =
        !!existingItem.id &&
        !String(existingItem.id).startsWith("temp_") &&
        existingItem.id !== "caixa_balcao";

      return updateQuantity(
        uniqueId,
        Number(item.quantity) || 1,
        isFromBackend,
      );
    }

    // --- 2. FLUXO DE ADIÇÃO (NOVO ITEM) ---

    // Fluxo Online (Mesas Livres, Comandas Temporárias ou Caixa Rápido)
    try {
      setIsSyncing(true);

      const isPlaceholderId =
        String(activeEntity.id).startsWith("mesa_") ||
        String(activeEntity.id).startsWith("temp_") ||
        activeEntity.id === "caixa_balcao";

      if (isPlaceholderId) {
        // Criar o pedido no backend com o primeiro item
        const response = await ordersService.createOrder({
          orderType: activeEntity.orderType || "COUNTER",
          reference: activeEntity.reference || "BALCÃO",
          operatorId: operatorId || "",
          total: createOrderItem.total,
          items: [
            {
              productId: createOrderItem.productId,
              quantity: createOrderItem.quantity,
              unitPrice: createOrderItem.unitPrice,
              notes: createOrderItem.notes,
            },
          ],
        });

        // Sincroniza e atualiza para a entidade real do backend
        await fetchOrders();
        updateOrderInState(response);
        setActiveEntity({
          id: response.id,
          orderType: response.orderType as any,
          name:
            response.orderType === "TABLE"
              ? `MESA ${response.reference}`
              : `COMANDA ${response.reference}`,
          reference: response.reference,
          label:
            response.orderType === "TABLE"
              ? `MESA ${response.reference}`
              : `CMD ${response.reference}`,
          status: response.status.toLowerCase() as any,
          total: parseFloat(response.total),
          items: response.items,
        });
        toast.success(
          `${
            activeEntity.orderType === "TABLE" ? "Mesa" : "Comanda"
          } aberta com sucesso!`,
        );
      } else {
        // Adicionar a um pedido que já existe no backend
        const response = await ordersService.addItemsToOrder(
          activeEntity.id,
          createOrderItem,
        );
        updateOrderInState(response);
        setActiveEntity((prev: any) => ({
          ...prev,
          total: parseFloat(response.total),
          items: response.items,
          status: "open",
        }));
      }
    } catch (error: any) {
      console.error("Erro ao processar item:", error);
      const message =
        error.response?.data?.message || "Erro ao conectar com o servidor.";
      toast.error(`Falha ao adicionar item: ${message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateQuantity = async (
    uniqueId: string,
    delta: number,
    isFromBackend: boolean,
  ) => {
    if (!activeEntity) return;
    setIsSyncing(true);

    try {
      if (isFromBackend) {
        const item = activeEntity.items?.find((i: any) => i.id === uniqueId);
        if (!item) return;
        const newQtd = Number(item.quantity) + delta;

        if (newQtd <= 0) {
          await ordersService.removeItem(uniqueId);
          await fetchOrders();
        } else {
          const response = await ordersService.updateItems(activeEntity.id, [
            { id: uniqueId, quantity: newQtd },
          ]);
          updateOrderInState(response);
        }
      } else {
        // Atualização Local (Rascunhos)
        setOrders((prev) => {
          const current = prev[activeEntity.id] || [];
          const updated = current
            .map((i) => {
              if (
                i.id === uniqueId ||
                i.uniqueId === uniqueId ||
                i.productId === uniqueId
              ) {
                const q = i.quantity + delta;
                return q <= 0 ? null : { ...i, quantity: q };
              }
              return i;
            })
            .filter(Boolean) as any[];
          return { ...prev, [activeEntity.id]: updated };
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
    } finally {
      setIsSyncing(false);
    }
  };
  const handleConfirmPayment = useCallback(
    async (data: {
      method: string;
      amount: number;
      subtotal: number;
      serviceTax: number;
      discount: number;
      customerId?: string;
    }) => {
      if (!activeEntity?.id || activeEntity.id.startsWith("temp_")) {
        console.warn(
          "Não é possível fechar um pedido temporário, conecte-se a internet.",
        );
        return;
      }

      try {
        setIsSyncing(true);
        const mappedMethod =
          data.method === "Fiado" ? "STORE_CREDIT" : data.method;
        await ordersService.closeOrder(
          activeEntity.id,
          mappedMethod,
          data.customerId || "",
          data.subtotal,
          data.serviceTax,
          data.discount,
          data.amount,
        );

        setOpenOrders((prev) => prev.filter((o) => o.id !== activeEntity.id));

        setActiveEntity(null);
        setCartMobileOpen(false);
      } catch (error) {
        console.error("Erro ao finalizar pagamento no servidor:", error);
      } finally {
        setIsSyncing(false);
      }
    },
    [
      activeEntity,
      setIsSyncing,
      setOpenOrders,
      setActiveEntity,
      setCartMobileOpen,
    ],
  );

  return {
    handleEntityClick,
    handleAddClick,
    handleCaixaRapido,
    handleCreateComanda,
    confirmAddToCart,
    updateQuantity,
    updateOrderInState,
    handleConfirmPayment,
  };
};

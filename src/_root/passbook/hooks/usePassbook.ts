import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  ordersService,
  type DayOrdersResponse,
} from "../../../services/orders/orders.service";
import type { CartItem } from "../../pdv/utils/pdv.types";

export function usePassbook() {
  const [selectedOrder, setSelectedOrder] = useState<DayOrdersResponse | null>(
    null,
  );
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);

  const handleViewNote = useCallback(async (orderId: string) => {
    if (!orderId) return;

    try {
      setIsLoadingOrder(true);
      const orderData = await ordersService.getOrderById(orderId);
      setSelectedOrder(orderData);
      setIsTicketOpen(true);
    } catch (error) {
      console.error("Erro ao carregar nota:", error);
      toast.error("Não foi possível carregar os detalhes desta nota.");
    } finally {
      setIsLoadingOrder(false);
    }
  }, []);

  const getMappedCart = useCallback((): CartItem[] => {
    if (!selectedOrder?.items) return [];

    return selectedOrder.items.map((it) => ({
      id: it.id,
      uniqueId: it.id,
      productId: it.productId,
      name: it.product?.name || "Produto",
      price: Number(it.unitPrice),
      quantity: it.quantity,
      obs: it.notes || [],
    }));
  }, [selectedOrder]);

  const activeEntityData = selectedOrder
    ? {
        label: selectedOrder.reference || "Nota",
        orderType: selectedOrder.orderType,
      }
    : null;

  return {
    selectedOrder,
    setIsTicketOpen,
    isTicketOpen,
    isLoadingOrder,
    handleViewNote,
    getMappedCart,
    activeEntityData,
  };
}

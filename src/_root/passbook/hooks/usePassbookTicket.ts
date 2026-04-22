// src/_features/passbook/hooks/usePassbookTicket.ts
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { LedgerEntry } from "../../../services/costomers/customer.type";
import { ordersService, type DayOrdersResponse } from "../../../services/orders/orders.service";

export function usePassbookTicket() {
  const [selectedOrder, setSelectedOrder] = useState<DayOrdersResponse | null>(null);
  const [selectedLedgerEntry, setSelectedLedgerEntry] = useState<LedgerEntry | null>(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);

  // A função que o seu botão do <Eye /> vai chamar
  const handleViewNote = useCallback(async (ledgerEntry: LedgerEntry) => {
    if (!ledgerEntry) return;
    try {
      setIsLoadingOrder(true);
      // O backend retorna os dados da nota a partir do ID
      if (ledgerEntry.orderId) {
        const orderData = await ordersService.getOrderById(ledgerEntry.orderId);
        setSelectedLedgerEntry(null);
        setSelectedOrder(orderData);
        setIsTicketOpen(true); // Abre o Sheet de recibo
      } else {
        toast.warning("Esta entrada não possui uma nota fiscal vinculada.");
        setSelectedOrder(null);
        setSelectedLedgerEntry(ledgerEntry);
        setIsTicketOpen(true); // Abre o Sheet de recibo
      }
    } catch (error) {
      console.error("Erro ao carregar nota:", error);
      toast.error("Não foi possível carregar os detalhes desta nota.");
    } finally {
      setIsLoadingOrder(false);
    }
  }, []);

  // Conversão dos itens para o formato que o Sheet de recibo entende
  const getMappedCart = useCallback(() => {
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

  // Formatação da entidade (Mesa, Balcão, etc)
  const activeEntityData = selectedOrder
    ? {
        label: selectedOrder.reference || "Nota",
        orderType: selectedOrder.orderType,
        description: (selectedOrder as any).description,
      }
    : selectedLedgerEntry
    ? {
        label: "Dívida",
        orderType: "Passbook",
        description: selectedLedgerEntry.description,
      }
    : null;

  return {
    selectedOrder,
    selectedLedgerEntry,
    isTicketOpen,
    setIsTicketOpen,
    isLoadingOrder,
    handleViewNote,
    getMappedCart,
    activeEntityData,
  };
}
import { useState } from "react";
import type { CostomersResponse } from "../../../services/costomers/customer.type";
export function usePassbookUI() {
  const [editingClient, setEditingClient] = useState<CostomersResponse | null>(null);
  
  // Estado para caso precise controlar o CustomerSheet via código (opcional, já que o Trigger faz quase tudo)
  const [isCustomerSheetOpen, setIsCustomerSheetOpen] = useState(false);
  
  // Estado do Modal de Pagamento
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const closeCustomerSheet = () => {
    setEditingClient(null);
    setIsCustomerSheetOpen(false);
  };

  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => setIsPaymentModalOpen(false);

  return {
    isCustomerSheetOpen,
    setIsCustomerSheetOpen,
    editingClient,
    setEditingClient,
    closeCustomerSheet,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    openPaymentModal,
    closePaymentModal,
  };
}
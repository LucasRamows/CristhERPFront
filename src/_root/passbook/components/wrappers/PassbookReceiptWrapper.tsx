// src/_features/passbook/components/PassbookReceiptWrapper.tsx
import { ViewCartReceiptSheet } from "../../../../components/shared/ViewCartReceiptSheet";
import { usePassbook } from "../../hooks/PassbookContext";

export function PassbookReceiptWrapper() {
  // Puxamos a lógica do Ticket/Recibo do nosso contexto da Caderneta
  const {
    selectedOrder,
    isTicketOpen,
    setIsTicketOpen,
    getMappedCart,
    activeEntityData,   
    selectedLedgerEntry,
  } = usePassbook();

  // Se não estiver aberto ou não tiver pedido nem dívida, nem renderiza
  if (!isTicketOpen || (!selectedOrder && !selectedLedgerEntry)) return null;

  // Fazemos as contas/castings pesados aqui, escondidos!
  return (
    <ViewCartReceiptSheet
      isOpen={isTicketOpen}
      onOpenChange={setIsTicketOpen}
      activeEntity={activeEntityData as any}
      cart={getMappedCart() as any}
      description={selectedLedgerEntry?.description || ""}
      subtotal={Number(selectedOrder?.subtotal || selectedLedgerEntry?.amount || 0)}
      discount={Number(selectedOrder?.discount || 0)}
      serviceTax={Number(selectedOrder?.serviceTax || 0)}
      timestamp={selectedOrder?.sale_date || selectedLedgerEntry?.createdAt || ""}
      total={Number(selectedOrder?.total || selectedLedgerEntry?.amount || 0)}
    />
  );
}
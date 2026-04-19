import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  costomersService,
  type CostomersResponse,
  type LedgerEntry,
} from "../../../services/costomers/customers.service";

export function usePassbookPage() {
  const [clients, setClients] = useState<CostomersResponse[]>([]);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [isCreateCustomerModalOpen, setIsCreateCustomerModalOpen] =
    useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingClient, setEditingClient] = useState<CostomersResponse | null>(
    null,
  );
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);

  const activeClient = useMemo(
    () => clients.find((client) => client.id === activeClientId) || null,
    [clients, activeClientId],
  );

  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await costomersService.getAllCustomers();
      setClients(response);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      toast.error("Não foi possível carregar a lista de clientes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (!activeClientId) {
      setLedgerEntries([]);
      return;
    }

    const fetchLedger = async () => {
      try {
        const response = await costomersService.getCustomerLedger(
          activeClientId,
        );
        setLedgerEntries(response);
      } catch (error) {
        console.error("Erro ao buscar histórico do cliente:", error);
      }
    };

    fetchLedger();
  }, [activeClientId]);

  const handlePayDebit = useCallback(
    async (data: {
      method: string;
      amount: number;
      discount: number;
      customerId?: string;
    }) => {
      if (!activeClient) return;

      try {
        const methodMap: Record<
          string,
          "PIX" | "Dinheiro" | "Cartão de Crédito" | "Cartão de Débito"
        > = {
          PIX: "PIX",
          CREDIT: "Cartão de Crédito",
          DEBIT: "Cartão de Débito",
          CASH: "Dinheiro",
        };

        const response = await costomersService.receivePayment(
          activeClient.id,
          data.amount,
          methodMap[data.method] || "Dinheiro",
          `Recebimento de dívida - ${data.method}`,
        );

        setLedgerEntries((prev) => [response, ...prev]);

        setClients((prev) =>
          prev.map((client) =>
            client.id === activeClient.id
              ? { ...client, saldoDevedor: client.saldoDevedor - data.amount }
              : client,
          ),
        );

        setIsPaymentModalOpen(false);
        toast.success("Pagamento recebido com sucesso!");
      } catch (error) {
        console.error("Erro ao receber pagamento:", error);
        toast.error("Erro ao processar o pagamento. Tente novamente.");
      }
    },
    [activeClient],
  );

  const handleDeleteTransaction = useCallback(
    async (transactionId: string, orderId: string, type: string) => {
      if (!transactionId) return;

      if (type === "PAYMENT") {
        try {
          await costomersService.deletePayment(transactionId);
          const tx = ledgerEntries.find((t) => t.id === transactionId);
          setLedgerEntries((prev) => prev.filter((t) => t.id !== transactionId));

          if (tx && activeClient) {
            setClients((prev) =>
              prev.map((client) =>
                client.id === activeClient.id
                  ? { ...client, saldoDevedor: client.saldoDevedor + Number(tx.amount) }
                  : client,
              ),
            );
          }
        } catch (error) {
          console.error("Erro ao deletar pagamento:", error);
          toast.error("Não foi possível excluir o pagamento.");
        }

        return;
      }

      try {
        await costomersService.deleteTransaction(orderId);

        setLedgerEntries((prev) => {
          const tx = prev.find((t) => t.id === transactionId);
          if (!tx) return prev;

          if (activeClient) {
            setClients((clientsPrev) =>
              clientsPrev.map((client) => {
                if (client.id !== activeClient.id) return client;

                let newSaldo = client.saldoDevedor;
                if (tx.type === "DEBT") {
                  newSaldo -= Number(tx.amount);
                } else {
                  newSaldo += Number(tx.amount);
                }

                return { ...client, saldoDevedor: newSaldo };
              }),
            );
          }

          return prev.filter((t) => t.id !== transactionId);
        });
      } catch (error) {
        console.error("Erro ao deletar transação:", error);
        toast.error("Não foi possível excluir a transação.");
      }
    },
    [activeClient, ledgerEntries],
  );

  const toggleBloqueio = useCallback(async () => {
    if (!activeClientId) return;

    try {
      const updatedClient = await costomersService.toggleCustomerBlock(
        activeClientId,
      );
      setClients((prev) =>
        prev.map((client) =>
          client.id === activeClientId ? { ...client, ...updatedClient } : client,
        ),
      );
    } catch (error) {
      console.error("Erro ao alternar bloqueio do cliente:", error);
      toast.error("Não foi possível alterar o bloqueio do cliente.");
    }
  }, [activeClientId]);

  const handleClientSuccess = useCallback((newOrUpdatedClient: CostomersResponse) => {
    setClients((prev) => {
      const exists = prev.find((client) => client.id === newOrUpdatedClient.id);
      if (exists) {
        return prev.map((client) =>
          client.id === newOrUpdatedClient.id ? { ...client, ...newOrUpdatedClient } : client,
        );
      }
      return [newOrUpdatedClient, ...prev];
    });
  }, []);

  const handleCreateCustomerOpenChange = useCallback(
    (open: boolean) => {
      setIsCreateCustomerModalOpen(open);
      if (!open) setEditingClient(null);
    },
    [],
  );

  const handleEditProfile = useCallback((client: CostomersResponse | null) => {
    setEditingClient(client);
    setIsCreateCustomerModalOpen(true);
  }, []);

  return {
    clients,
    activeClient,
    activeClientId,
    setActiveClientId,
    isCreateCustomerModalOpen,
    setIsCreateCustomerModalOpen,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    isLoading,
    editingClient,
    ledgerEntries,
    handlePayDebit,
    handleDeleteTransaction,
    toggleBloqueio,
    handleClientSuccess,
    handleCreateCustomerOpenChange,
    handleEditProfile,
    setClients,
  };
}

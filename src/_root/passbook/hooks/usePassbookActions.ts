// src/_features/passbook/hooks/usePassbookActions.ts
import { useCallback } from "react";
import { toast } from "sonner";
import type { PassbookActionsProps } from "../types/context.type";
import { costomersService } from "../../../services/costomers/customers.service";

export function usePassbookActions({
  setClients,
  setLedgerEntries,
  setIsLoadingData,
  activeClientId,
}: PassbookActionsProps) {
  const fetchClients = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const data = await costomersService.getAllCustomers();
      setClients(data);
    } catch (error) {
      toast.error("Erro ao carregar lista de clientes.");
    } finally {
      setIsLoadingData(false);
    }
  }, [setClients, setIsLoadingData]);

  const fetchLedger = useCallback(
    async (clientId: string) => {
      try {
        const data = await costomersService.getCustomerLedger(clientId);
        setLedgerEntries(data);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        toast.error("Erro ao buscar histórico do cliente.");
      }
    },
    [setLedgerEntries],
  );

  const addDebtAction = async (data: {
    description: string;
    amount: number;
    date: Date;
  }) => {
    if (!activeClientId) return;
    try {
      const newDebt = await costomersService.addDebt(activeClientId, {
        type: "DEBT",
        amount: data.amount,
        description: data.description,
        createdAt: data.date.toISOString(),
      });

      // Atualiza extrato e saldo do cliente na lista
      setLedgerEntries((prev) => [newDebt, ...prev]);
      setClients((prev) =>
        prev.map((c) =>
          c.id === activeClientId
            ? { ...c, saldoDevedor: Number(c.saldoDevedor) + data.amount }
            : c,
        ),
      );

      toast.success("Dívida lançada com sucesso!");
    } catch (error) {
      toast.error("Erro ao lançar dívida.");
      throw error; // Lança o erro para o componente lidar (ex: parar botão de loading)
    }
  };

  const deleteTransactionAction = async (
    transactionId: string,
    type: string,
  ) => {
    if (!transactionId || !activeClientId) return;

    try {
      if (type === "PAYMENT") {
        await costomersService.deletePayment(transactionId);
      } else {
        await costomersService.deleteTransaction(transactionId);
      }

      // Atualiza o extrato e recalcula o saldo localmente
      setLedgerEntries((prev) => {
        const tx = prev.find((t) => t.id === transactionId);
        if (tx) {
          setClients((clientsPrev) =>
            clientsPrev.map((client) => {
              if (client.id !== activeClientId) return client;

              let newSaldo = client.saldoDevedor;
              if (type === "PAYMENT" || tx.type === "PAYMENT") {
                newSaldo += Number(tx.amount); // Reverte pagamento (aumenta dívida)
              } else {
                newSaldo -= Number(tx.amount); // Reverte dívida (diminui dívida)
              }
              return { ...client, saldoDevedor: newSaldo };
            }),
          );
        }
        return prev.filter((t) => t.id !== transactionId);
      });

      toast.success("Movimentação excluída.");
    } catch (error) {
      toast.error("Erro ao excluir movimentação.");
    }
  };

  const receivePaymentAction = async (data: {
    method: string;
    amount: number;
    discount: number;
    customerId?: string;
  }) => {
    if (!activeClientId) return;

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
        activeClientId, // Usa o ID do contexto!
        data.amount,
        methodMap[data.method] || "Dinheiro",
        `Recebimento de dívida - ${data.method}`,
      );

      // 1. Atualiza o extrato
      setLedgerEntries((prev) => [response, ...prev]);

      // 2. Atualiza o saldo na lista lateral
      setClients((prev) =>
        prev.map((client) =>
          client.id === activeClientId
            ? { ...client, saldoDevedor: client.saldoDevedor - data.amount }
            : client,
        ),
      );

      toast.success("Pagamento recebido com sucesso!");

      // Retornamos true para avisar o PaymentModal que deu certo e ele pode se fechar
      return true;
    } catch (error) {
      console.error("Erro ao receber pagamento:", error);
      toast.error("Erro ao processar o pagamento. Tente novamente.");
      throw error; // Joga o erro pra frente pro Modal parar a animação de loading
    }
  };
  // --- 5. BLOQUEAR/DESBLOQUEAR CLIENTE ---
  const toggleBlockAction = async () => {
    if (!activeClientId) return;
    try {
      const updatedClient = await costomersService.toggleCustomerBlock(
        activeClientId,
      );
      setClients((prev) =>
        prev.map((c) =>
          c.id === activeClientId ? { ...c, ...updatedClient } : c,
        ),
      );
      toast.success("Status do cliente atualizado.");
    } catch (error) {
      toast.error("Erro ao alterar bloqueio.");
    }
  };

  return {
    fetchClients,
    fetchLedger,
    addDebtAction,
    deleteTransactionAction,
    toggleBlockAction,
    receivePaymentAction,
  };
}

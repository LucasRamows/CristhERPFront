import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  costomersService,
  type CostomersResponse,
  type LedgerEntry,
} from "../../services/costomers/customers.service";
import { PassbookClientDetailsPanel } from "../components/passbook/PassbookClientDetailsPanel";
import { PassbookClientListPanel } from "../components/passbook/PassbookClientListPanel";
import RootCreateCustomerSheet from "../components/passbook/RootCreateCustomerSheet";
import { PdvPaymentModal } from "../components/pdv/PdvPaymentModal";
import LoadingComponent from "../../components/shared/LoadingComponent";
import { SearhListPicker } from "../../components/shared/SearhListPicker";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";

export default function RootPassBookPage() {
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

  const activeClient = clients.find((c) => c.id === activeClientId) || null;
  const handlePayDebit = async (data: {
    method: string;
    amount: number;
    discount: number;
    customerId?: string;
  }) => {
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
        activeClient!.id,
        data.amount,
        methodMap[data.method] || "Dinheiro",
        `Recebimento de dívida - ${data.method}`,
      );

      setLedgerEntries((prev) => [response, ...prev]);

      setClients((prev) =>
        prev.map((c) =>
          c.id === activeClient!.id
            ? { ...c, saldoDevedor: c.saldoDevedor - data.amount }
            : c,
        ),
      );

      setIsPaymentModalOpen(false);
      toast.success("Pagamento recebido com sucesso!");
    } catch (error) {
      console.error("Erro ao receber pagamento:", error);
      toast.error("Erro ao processar o pagamento. Tente novamente.");
    }
  };
  const handleDeleteTransaction = async (
    transactionId: string,
    orderId: string,
    type: string,
  ) => {
    if (!transactionId) return;

    if (type === "PAYMENT") {
      try {
        await costomersService.deletePayment(transactionId);
        const tx = ledgerEntries.find((t) => t.id === transactionId);
        setLedgerEntries((prev) => prev.filter((t) => t.id !== transactionId));
        if (tx) {
          setClients((prev) =>
            prev.map((c) =>
              c.id === activeClient!.id
                ? { ...c, saldoDevedor: c.saldoDevedor + Number(tx.amount) }
                : c,
            ),
          );
        }
      } catch (error) {
        console.error("Erro ao deletar pagamento:", error);
      }
      return;
    }

    try {
      await costomersService.deleteTransaction(orderId);

      setLedgerEntries((prev) => {
        const tx = prev.find((t) => t.id === transactionId);
        if (!tx) return prev;

        // Atualiza saldo do cliente
        setClients((clientsPrev) =>
          clientsPrev.map((c) => {
            if (c.id !== activeClientId) return c;

            let newSaldo = c.saldoDevedor;

            if (tx.type === "DEBT") {
              // remove dívida -> saldo diminui
              newSaldo -= Number(tx.amount);
            } else {
              // remove pagamento -> saldo aumenta
              newSaldo += Number(tx.amount);
            }

            return { ...c, saldoDevedor: newSaldo };
          }),
        );

        return prev.filter((t) => t.id !== transactionId);
      });
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
    }
  };
  const toggleBloqueio = async () => {
    if (!activeClientId) return;

    try {
      const updatedClient = await costomersService.toggleCustomerBlock(
        activeClientId,
      );
      console.log("Cliente atualizado:", updatedClient);
      setClients((prev) =>
        prev.map((c) =>
          c.id === activeClientId ? { ...c, ...updatedClient } : c,
        ),
      );
    } catch (error) {
      console.error("Erro ao alternar bloqueio do cliente:", error);
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const response = await costomersService.getAllCustomers();
        setClients(response);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

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
  if (isLoading) {
    return <LoadingComponent />;
  }
  return (
    <div className="flex gap-4 flex-col w-full bg-background overflow-hidden select-none">
      <div className="flex gap-2">
        <div className="flex-1 w-full">
          <SearhListPicker
            items={clients}
            onSelect={(client) => setActiveClientId(client.id)}
            placeholder="Buscar apelido ou nome..."
            searchKeys={["fullName", "nickname"]}
            avatarText={(client) => client.nickname.charAt(0).toUpperCase()}
            renderTitle={(client) => client.nickname}
            renderSubtitle={(client) => client.fullName}
          />
        </div>
        <Button onClick={() => setIsCreateCustomerModalOpen(true)}>
          <Plus size={20} />
          <span className="hidden sm:inline">Adicionar</span>
        </Button>
      </div>
      <div className="flex h-full w-full overflow-hidden card-default">
        <PassbookClientListPanel
          clients={clients}
          activeClientId={activeClientId}
          setActiveClientId={setActiveClientId}
        />

        {/* LADO DIREITO: DETALHES DO CLIENTE */}
        <PassbookClientDetailsPanel
          activeClient={activeClient}
          handleDeleteTransaction={handleDeleteTransaction}
          setActiveClientId={setActiveClientId}
          transactions={ledgerEntries}
          toggleBloqueio={toggleBloqueio}
          setIsPaymentModalOpen={setIsPaymentModalOpen}
          onEditProfile={() => {
            setEditingClient(activeClient);
            setIsCreateCustomerModalOpen(true);
          }}
        />
      </div>
      {/* MODAL: RECEBER PAGAMENTO */}
      {isPaymentModalOpen && activeClient && (
        <PdvPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          subtotal={0}
          serviceTax={0}
          total={activeClient.saldoDevedor}
          mode="payment_only"
          hideFiado
          title={`Receber de ${activeClient.nickname}`}
          onConfirm={handlePayDebit}
        />
      )}
      {/* SHEET: CADASTRAR CLIENTE */}
      <RootCreateCustomerSheet
        open={isCreateCustomerModalOpen}
        setClients={setClients}
        onOpenChange={(open) => {
          setIsCreateCustomerModalOpen(open);
          if (!open) setEditingClient(null);
        }}
        initialData={editingClient}
        onSuccess={(newOrUpdatedClient) => {
          setClients((prev) => {
            const exists = prev.find((c) => c.id === newOrUpdatedClient.id);
            if (exists) {
              return prev.map((c) =>
                c.id === newOrUpdatedClient.id ? newOrUpdatedClient : c,
              );
            }
            return [newOrUpdatedClient, ...prev];
          });
        }}
      />
    </div>
  );
}

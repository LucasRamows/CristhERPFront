import { Plus, Search } from "lucide-react";
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
import { toast } from "sonner";

export default function RootPassBookPage() {
  const [clients, setClients] = useState<CostomersResponse[]>([]);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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
        "PIX" | "CASH" | "CREDIT_CARD" | "DEBIT_CARD"
      > = {
        PIX: "PIX",
        Crédito: "CREDIT_CARD",
        Débito: "DEBIT_CARD",
        Dinheiro: "CASH",
      };

      const response = await costomersService.receivePayment(
        activeClient!.id,
        data.amount,
        methodMap[data.method] || "CASH",
        `Recebimento de dívida - ${data.method}`,
      );

      // Atualiza histórico
      setLedgerEntries((prev) => [response, ...prev]);

      // Atualiza saldo na lista de clientes
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
  ) => {
    if (!transactionId) return;

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
      {/* WRAPPER PRINCIPAL */}{" "}
      <div className="flex gap-2">
        <div className="flex-1 flex bg-gray-100 rounded-2xl px-4 py-3 items-center border border-gray-200 focus-within:border-[#44A08D] focus-within:bg-white transition-colors">
          <Search size={18} className="text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Buscar apelido ou nome..."
            className="bg-transparent border-none outline-none w-full font-semibold text-gray-700 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsCreateCustomerModalOpen(true)}
          className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-gray-800 transition-colors shrink-0"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="flex h-full w-full overflow-hidden bg-white rounded-2xl">
        {/* LADO ESQUERDO: LISTA DE CLIENTES */}
        <PassbookClientListPanel
          clients={clients}
          activeClientId={activeClientId}
          setActiveClientId={setActiveClientId}
          searchQuery={searchQuery}
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
      {/* --- ESTILOS E ANIMAÇÕES --- */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `,
        }}
      />
    </div>
  );
}

import { Plus } from "lucide-react";
import LoadingComponent from "../../components/shared/LoadingComponent";
import { SearchListPicker } from "../../components/shared/SearchListPicker";
import { Button } from "../../components/ui/button";
import { PaymentModal } from "../pdv/components/modals/PaymentModal";
import { ClientDetailsModal } from "./components/ClientDetailsModal";
import { ClientsListModal } from "./components/ClientsListModal";
import CustomerSheet from "./components/sheets/CustomerSheet";
import { PassbookProvider, usePassbook } from "./hooks/PassbookContext";


function PassBook() {
  const {
    clients,
    activeClient,
    setActiveClientId,
    isLoadingData, // Vem do usePassbookData
    isPaymentModalOpen, // Vem do usePassbookUI
    closePaymentModal, // Vem do usePassbookUI
    receivePaymentAction, // Vem do usePassbookActions (Confirme o nome da sua ação de pagar)
  } = usePassbook();

  // Verifica o Loading do Data Context
  if (isLoadingData) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex gap-4 flex-col w-full bg-background overflow-hidden select-none">
      {/* BARRA SUPERIOR: BUSCA E ADICIONAR */}
      <div className="flex gap-2">
        <div className="flex-1 w-full">
          <SearchListPicker
            items={clients}
            onSelect={(client) => setActiveClientId(client.id)}
            placeholder="Buscar apelido ou nome..."
            searchKeys={["fullName", "nickname"]}
            avatarText={(client) => client.nickname.charAt(0).toUpperCase()}
            renderTitle={(client) => client.nickname}
            renderSubtitle={(client) => client.fullName}
          />
        </div>

        {/* SMART COMPONENT: Envelopa o botão nativamente */}
        <CustomerSheet mode="create">
          <Button>
            <Plus size={20} />
            <span className="hidden sm:inline">Adicionar</span>
          </Button>
        </CustomerSheet>
      </div>

      <div className="flex h-full w-full overflow-hidden card-default">
        {/* LADO ESQUERDO: LISTA DE CLIENTES (Sem props) */}
        <ClientsListModal />

        {/* LADO DIREITO: DETALHES DO CLIENTE (Sem props) */}
        <ClientDetailsModal />
      </div>

      {/* MODAL: RECEBER PAGAMENTO */}
      {isPaymentModalOpen && activeClient && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          subtotal={0}
          serviceTax={0}
          total={activeClient.saldoDevedor}
          mode="payment_only"
          hideFiado
          title={`Receber de ${activeClient.nickname}`}
          onConfirm={async (data) => {
            await receivePaymentAction(data);
            closePaymentModal();
          }}
        />
      )}
    </div>
  );
}

export default function RootPassBookPage() {
  return (
    <PassbookProvider>
      <PassBook />
    </PassbookProvider>
  );
}

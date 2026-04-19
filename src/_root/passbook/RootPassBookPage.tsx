import { Plus } from "lucide-react";
import { PassbookClientDetailsPanel } from "./components/PassbookClientDetailsPanel";
import { PassbookClientListPanel } from "./components/PassbookClientListPanel";
import RootCreateCustomerSheet from "./components/sheets/RootCreateCustomerSheet";
import LoadingComponent from "../../components/shared/LoadingComponent";
import { SearchListPicker } from "../../components/shared/SearchListPicker";
import { Button } from "../../components/ui/button";
import { usePassbookPage } from "./hooks/usePassbookPage";
import { PaymentModal } from "../pdv/components/modals/PaymentModal";

export default function RootPassBookPage() {
  const {
    clients,
    activeClient,
    activeClientId,
    setActiveClientId,
    isCreateCustomerModalOpen,
    isPaymentModalOpen,
    isLoading,
    editingClient,
    ledgerEntries,
    handlePayDebit,
    handleDeleteTransaction,
    toggleBloqueio,
    handleClientSuccess,
    handleCreateCustomerOpenChange,
    handleEditProfile,
    setIsPaymentModalOpen,
    setIsCreateCustomerModalOpen,
    setClients,
  } = usePassbookPage();
  if (isLoading) {
    return <LoadingComponent />;
  }
  return (
    <div className="flex gap-4 flex-col w-full bg-background overflow-hidden select-none">
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
          onEditProfile={() => handleEditProfile(activeClient)}
        />
      </div>
      {/* MODAL: RECEBER PAGAMENTO */}
      {isPaymentModalOpen && activeClient && (
        <PaymentModal
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
        onOpenChange={handleCreateCustomerOpenChange}
        initialData={editingClient}
        onSuccess={handleClientSuccess}
      />
    </div>
  );
}

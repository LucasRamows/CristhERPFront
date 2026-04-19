import { History as HistoryIcon, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import LoadingComponent from "../../components/shared/LoadingComponent";
import { PageTabNavigation } from "../../components/shared/PageTabNavigation";
import { SearchListPicker } from "../../components/shared/SearchListPicker";
import { StatCard } from "../../components/shared/StatCard";
import { Button } from "../../components/ui/button";
import { SupplierCard } from "./components/SupplierCard";
import { CreateSupplierSheet } from "./components/SupplierCreateSheet";
import { SupplierHistorySheet } from "./components/SupplierHistorySheet";
import {
  SuppliersProvider,
  useSuppliersContext,
} from "./hooks/SuppliersContext";

function RootSuppliersPageContent() {
  const {
    suppliers,
    filteredSuppliers,
    filteredNav,
    selectedSupplier,
    isLoading,
    isCreateSheetOpen,
    isHistorySheetOpen,
    activeView,
    setActiveView,
    setSearchTerm,
    setIsCreateSheetOpen,
    setSelectedNote,
    setIsHistorySheetOpen,
    handleDelete,
    handleOpenHistory,
    addSupplier,
    updateSupplier,
  } = useSuppliersContext();

  if (isLoading) return <LoadingComponent />;

  return (
    <div className="flex gap-4 flex-col w-full bg-background overflow-hidden select-none">
      <div className="flex h-12 md:min-h-14 w-full items-center justify-between">
        <PageTabNavigation
          tabs={filteredNav}
          activeTab={activeView}
          onTabChange={(id) => setActiveView(id)}
          className="bg-muted"
        />
      </div>

      {activeView === "suppliers" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
            <StatCard
              title="Total de Fornecedores"
              value={suppliers.length}
              icon={<Users size={20} />}
              color="emerald"
              trend="Parceiros Ativos"
            />
          </div>

          <div className="h-full flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 group w-full">
              <SearchListPicker
                items={suppliers}
                onSelect={(item) => setSearchTerm(item.name)}
                placeholder="Buscar fornecedor por nome ou documento..."
                searchKeys={["name", "identification"]}
                avatarText={(item) => item.name.charAt(0).toUpperCase()}
                renderTitle={(item) => item.name}
                renderSubtitle={(item) => item.identification}
              />
            </div>
            <Button onClick={() => setIsCreateSheetOpen(true)}>
              <Plus size={22} strokeWidth={3} />
              Adicionar Fornecedor
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  onClick={() => handleOpenHistory(supplier)}
                />
              ))
            ) : (
              <div className="col-span-full py-32 flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-800 gap-6">
                <div className="w-32 h-32 bg-zinc-50 dark:bg-zinc-900 rounded-[50px] border-4 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                  <HistoryIcon size={64} className="opacity-20" />
                </div>
                <div className="text-center">
                  <p className="font-extrabold text-2xl tracking-tighter text-zinc-400">
                    Nenhum fornecedor encontrado
                  </p>
                  <p className="font-bold text-zinc-400 mt-1 uppercase text-xs tracking-widest opacity-50">
                    Tente ajustar seus filtros ou busca
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <CreateSupplierSheet
        isOpen={isCreateSheetOpen}
        onClose={() => setIsCreateSheetOpen(false)}
        onCreated={(newSup) => {
          addSupplier(newSup);
          setIsCreateSheetOpen(false);
          toast.success("Fornecedor cadastrado com sucesso!");
        }}
      />

      <SupplierHistorySheet
        supplier={selectedSupplier}
        isOpen={isHistorySheetOpen}
        onClose={() => setIsHistorySheetOpen(false)}
        onEditNote={(note) => {
          setSelectedNote(note);
          setActiveView("entry-notes");
          setIsHistorySheetOpen(false);
        }}
        onUpdate={(updatedSup) => {
          updateSupplier(updatedSup);
        }}
        onDelete={(id) => {
          handleDelete(id);
          setIsHistorySheetOpen(false);
        }}
      />
    </div>
  );
}

export default function RootSuppliersPage() {
  return (
    <SuppliersProvider>
      <RootSuppliersPageContent />
    </SuppliersProvider>
  );
}

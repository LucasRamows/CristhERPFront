import { History as HistoryIcon, Plus, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import LoadingComponent from "../../components/shared/LoadingComponent";
import { SearhListPicker } from "../../components/shared/SearhListPicker";
import { Button } from "../../components/ui/button";
import {
  suppliersService,
  type SupplierResponse,
} from "../../services/suppliers/suppliers.service";
import { DashboardStatCard } from "../components/dashboard/DashboardStatCard";
import { SupplierCard } from "../components/supplier/SupplierCard";
import { SupplierHistorySheet } from "../components/supplier/SupplierHistorySheet";
import { CreateSupplierSheet } from "../components/supplier/SupplierSheet";

export default function RootSuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierResponse | null>(null);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.identification?.includes(searchTerm);

      return matchesSearch;
    });
  }, [suppliers, searchTerm]);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await suppliersService.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este fornecedor?")) return;
    try {
      await suppliersService.deleteSupplier(id);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      toast.success("Fornecedor removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover fornecedor.");
    }
  };

  const handleOpenHistory = (supplier: SupplierResponse) => {
    setSelectedSupplier(supplier);
    setIsHistorySheetOpen(true);
  };

  if (isLoading) return <LoadingComponent />;

  return (
    <div className="flex gap-4 flex-col w-full bg-background overflow-hidden select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
        <DashboardStatCard
          title="Total de Fornecedores"
          value={suppliers.length}
          icon={<Users size={20} />}
          color="emerald"
          trend="Parceiros Ativos"
        />
      </div>

      <div className="h-full flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <SearhListPicker
            items={suppliers}
            onSelect={(item) => setSearchTerm(item.name)}
            placeholder="Buscar produto por nome, código ou categoria..."
            searchKeys={["name", "identification"]}
            avatarText={(item) => item.name.charAt(0).toUpperCase()}
            renderTitle={(item) => item.name}
            renderSubtitle={(item) => item.identification}
          />
        </div>
        <Button
          onClick={() => {
            setIsCreateSheetOpen(true);
          }}
        >
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
              onDelete={handleDelete}
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

      <CreateSupplierSheet
        isOpen={isCreateSheetOpen}
        onClose={() => setIsCreateSheetOpen(false)}
        onCreated={(newSup) => {
          setSuppliers((prev) => [...prev, newSup]);
          setIsCreateSheetOpen(false);
          toast.success("Fornecedor cadastrado com sucesso!");
        }}
      />

      <SupplierHistorySheet
        supplier={selectedSupplier}
        isOpen={isHistorySheetOpen}
        onClose={() => setIsHistorySheetOpen(false)}
      />
    </div>
  );
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthenticatedUser } from "../../../contexts/DataContext";
import { supplierTabs } from "../../../lib/sidebarNavFilter";
import {
  suppliersService,
  type SupplierResponse,
} from "../../../services/suppliers/suppliers.service";

interface SuppliersContextValue {
  suppliers: SupplierResponse[];
  filteredSuppliers: SupplierResponse[];
  filteredNav: typeof supplierTabs;
  selectedSupplier: SupplierResponse | null;
  isLoading: boolean;
  isCreateSheetOpen: boolean;
  isHistorySheetOpen: boolean;
  activeView: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setActiveView: (value: string) => void;
  setIsCreateSheetOpen: (value: boolean) => void;
  setSelectedNote: (value: any) => void;
  setIsHistorySheetOpen: (value: boolean) => void;
  fetchSuppliers: () => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleOpenHistory: (supplier: SupplierResponse) => void;
  setSelectedSupplier: (value: SupplierResponse | null) => void;
  addSupplier: (supplier: SupplierResponse) => void;
  updateSupplier: (supplier: SupplierResponse) => void;
}

const SuppliersContext = createContext<SuppliersContextValue | null>(null);

export function SuppliersProvider({ children }: { children: React.ReactNode }) {
  const { businessType } = useAuthenticatedUser();
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState<string>("suppliers");
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierResponse | null>(null);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [, setSelectedNote] = useState<any>(null);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);

  const filteredNav = useMemo(
    () =>
      supplierTabs.filter(
        (item) =>
          item.businessType === "ALL" || item.businessType === businessType,
      ),
    [businessType],
  );

  const filteredSuppliers = useMemo(
    () =>
      suppliers.filter((supplier) => {
        const normalized = searchTerm.toLowerCase();
        return (
          supplier.name.toLowerCase().includes(normalized) ||
          supplier.phone?.includes(searchTerm) ||
          supplier.identification?.includes(searchTerm)
        );
      }),
    [suppliers, searchTerm],
  );

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await suppliersService.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      toast.error("Não foi possível carregar os fornecedores.");
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
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
      toast.success("Fornecedor removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover fornecedor:", error);
      toast.error("Erro ao remover fornecedor.");
    }
  };

  const handleOpenHistory = (supplier: SupplierResponse) => {
    setSelectedSupplier(supplier);
    setIsHistorySheetOpen(true);
  };

  const addSupplier = (supplier: SupplierResponse) => {
    setSuppliers((prev) => [...prev, supplier]);
  };

  const updateSupplier = (supplier: SupplierResponse) => {
    setSuppliers((prev) =>
      prev.map((item) => (item.id === supplier.id ? supplier : item)),
    );
  };

  return (
    <SuppliersContext.Provider
      value={{
        suppliers,
        filteredSuppliers,
        filteredNav,
        selectedSupplier,
        isLoading,
        isCreateSheetOpen,
        isHistorySheetOpen,
        activeView,
        searchTerm,
        setSearchTerm,
        setActiveView,
        setIsCreateSheetOpen,
        setSelectedNote,
        setIsHistorySheetOpen,
        fetchSuppliers,
        handleDelete,
        handleOpenHistory,
        setSelectedSupplier,
        addSupplier,
        updateSupplier,
      }}
    >
      {children}
    </SuppliersContext.Provider>
  );
}

export function useSuppliersContext() {
  const context = useContext(SuppliersContext);
  if (!context) {
    throw new Error(
      "useSuppliersContext must be used within a SuppliersProvider",
    );
  }
  return context;
}

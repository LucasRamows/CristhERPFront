import { Layers, Tags } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuthenticatedUser } from "../../contexts/DataContext";
import { restaurantService } from "../../services/restaurant/restaurant.service";

import { ClassCreationSheet } from "../components/settings/ClassCreationSheet";
import { SettingsAppearanceCard } from "../components/settings/SettingsAppearanceCard";
import {
  SettingsDataClassesCard,
  type ClassItem,
} from "../components/settings/SettingsDataClassesCard";
import { SettingsSaleModesCard } from "../components/settings/SettingsSaleModesCard";
import { TableSettingsSheet } from "../components/settings/TableSettingsSheet";

const RootSettingsPage: React.FC = () => {
  const { data: user, refreshData } = useAuthenticatedUser();

  // ==========================================
  // ESTADOS (APARÊNCIA E SISTEMA)
  // ==========================================
  const [receiveNotifications, setReceiveNotifications] = useState(true);

  // ==========================================
  // ESTADOS (MESAS E TIPOS DE VENDA)
  // ==========================================
  const [initialTables, setInitialTables] = useState(
    user?.restaurant?.totalTables || 10,
  );
  const [isTableDrawerOpen, setIsTableDrawerOpen] = useState(false);
  const [isSavingTables, setIsSavingTables] = useState(false);

  const [saleModes, setSaleModes] = useState({
    mesas: true,
    comandas: false,
    caixaRapido: true,
  });

  // Sync initial tables if user data changes
  useEffect(() => {
    if (user?.restaurant?.totalTables) {
      setInitialTables(user.restaurant.totalTables);
    }
  }, [user?.restaurant?.totalTables]);

  const handleSaveTables = async (newTotalTables: number) => {
    try {
      setIsSavingTables(true);
      await restaurantService.updateTables(newTotalTables);
      await refreshData(); // refresh contexts
      setInitialTables(newTotalTables); // optimistically update
      setIsTableDrawerOpen(false);
      toast.success("Quantidade de mesas atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar mesas:", error);
      toast.error("Erro ao atualizar mesas. Tente novamente.");
    } finally {
      setIsSavingTables(false);
    }
  };

  // ==========================================
  // ESTADOS (CLASSES)
  // ==========================================
  const [productClasses, setProductClasses] = useState<ClassItem[]>(
    user?.restaurant?.ProductCategories || [],
  );

  const [supplierClasses, setSupplierClasses] = useState<ClassItem[]>(
    user?.restaurant?.SupplierCategories || [],
  );

  const [isClassDrawerOpen, setIsClassDrawerOpen] = useState(false);
  const [activeClassType, setActiveClassType] = useState<
    "product" | "supplier"
  >("product");

  const openClassDrawer = (type: "product" | "supplier") => {
    setActiveClassType(type);
    setIsClassDrawerOpen(true);
  };

  const handleSaveClass = async (name: string, type: "product" | "supplier") => {
    try {
      if (type === "product") {
         const newClass = await restaurantService.createProductCategory(name);
         setProductClasses((prev) => [...prev, { ...newClass, _count: { products: 0, suppliers: 0 } }]);
      } else {
         const newClass = await restaurantService.createSupplierCategory(name);
         setSupplierClasses((prev) => [...prev, { ...newClass, _count: { products: 0, suppliers: 0 } }]);
      }
      await refreshData();
      toast.success("Classe criada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar classe.");
    }
  };

  const handleDeleteClass = async (id: string, type: "product" | "supplier") => {
    try {
      if (type === "product") {
         await restaurantService.deleteProductCategory(id);
         setProductClasses((prev) => prev.filter((c) => c.id !== id));
      } else {
         await restaurantService.deleteSupplierCategory(id);
         setSupplierClasses((prev) => prev.filter((c) => c.id !== id));
      }
      await refreshData();
      toast.success("Classe deletada com sucesso!");
    } catch (error) {
       console.error(error);
       toast.error("Erro ao deletar classe.");
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* CARD 1: PREFERÊNCIAS DO SISTEMA */}
        <SettingsAppearanceCard
          receiveNotifications={receiveNotifications}
          setReceiveNotifications={setReceiveNotifications}
        />

        {/* CARD 2: TIPOS DE VENDA */}
        <SettingsSaleModesCard
          saleModes={saleModes}
          setSaleModes={setSaleModes}
          totalTables={initialTables}
          openTableDrawer={() => setIsTableDrawerOpen(true)}
        />

        {/* CARD 3: CLASSES DE PRODUTOS */}
        <SettingsDataClassesCard
          title="Classes de Produtos"
          icon={Tags}
          emptyIcon={Tags}
          emptyText="Nenhuma classe de produto"
          countSuffix="itens vinculados"
          classes={productClasses}
          onOpenDrawer={() => openClassDrawer("product")}
          onDeleteClass={async (id) => handleDeleteClass(id, "product")}
        />

        {/* CARD 4: CLASSES DE FORNECEDORES */}
        <SettingsDataClassesCard
          title="Classes de Fornec."
          icon={Layers}
          emptyIcon={Layers}
          emptyText="Nenhuma classe de fornecedor"
          countSuffix="fornec. vinculados"
          classes={supplierClasses}
          onOpenDrawer={() => openClassDrawer("supplier")}
          onDeleteClass={async (id) => handleDeleteClass(id, "supplier")}
        />
      </div>

      {/* DRAWER 1: QUANTIDADE DE MESAS (Usando ui/sheet) */}
      <TableSettingsSheet
        isOpen={isTableDrawerOpen}
        onOpenChange={setIsTableDrawerOpen}
        initialTables={initialTables}
        onSave={handleSaveTables}
        isSaving={isSavingTables}
      />

      {/* DRAWER 2: CRIAÇÃO DE CLASSES (Usando ui/sheet) */}
      <ClassCreationSheet
        isOpen={isClassDrawerOpen}
        onOpenChange={setIsClassDrawerOpen}
        activeClassType={activeClassType}
        onSaveClass={handleSaveClass}
      />
    </div>
  );
};

export default RootSettingsPage;

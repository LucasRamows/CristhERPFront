"use client";

import { Layers, Tags } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { restaurantService } from "../../services/restaurant/restaurant.service";

import { SettingsDataClassesCard } from "./components/SettingsDataClassesCard";

import type { Category } from "../../components/shared/CategoryFilter";
import { useAuthenticatedUser } from "../../contexts/DataContext";
import { ClassCreationSheet } from "./components/ClassCreationSheet";
import { SettingsSaleModesCard } from "./components/SettingsSaleModesCard";
import { TableSettingsSheet } from "./components/TableSettingsSheet";

const RootSettingsPage = () => {
  const {
    categories,
    supplierCategories,
    refreshData,
    businessType,
    totalTables,
  } = useAuthenticatedUser();

  const isRetail = businessType === "RETAIL";
  const [initialTables, setInitialTables] = useState(totalTables);

  const [productClasses, setProductClasses] = useState<Category[]>(categories);
  const [supplierClasses, setSupplierClasses] =
    useState<Category[]>(supplierCategories);

  const [isClassDrawerOpen, setIsClassDrawerOpen] = useState(false);
  const [activeClassType, setActiveClassType] = useState<
    "product" | "supplier"
  >("product");

  useEffect(() => {
    setProductClasses(categories);
    setSupplierClasses(supplierCategories);
  }, [categories, supplierCategories]);
  // HANDLERS
  // ==========================================
  const openClassDrawer = (type: "product" | "supplier") => {
    setActiveClassType(type);
    setIsClassDrawerOpen(true);
  };

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
  // ESTADOS (MESAS E TIPOS DE VENDA)
  // ==========================================

  const [isTableDrawerOpen, setIsTableDrawerOpen] = useState(false);
  const [isSavingTables, setIsSavingTables] = useState(false);

  const [saleModes, setSaleModes] = useState({
    mesas: true,
    comandas: false,
    caixaRapido: true,
  });

  const handleSaveClass = async (
    name: string,
    type: "product" | "supplier",
  ) => {
    try {
      if (type === "product") {
        const newClass = await restaurantService.createProductCategory(name);
        setProductClasses((prev) => [
          ...prev,
          { ...newClass, _count: { products: 0 } },
        ]);
      } else {
        const newClass = await restaurantService.createSupplierCategory(name);
        setSupplierClasses((prev) => [
          ...prev,
          { ...newClass, _count: { suppliers: 0 } },
        ]);
      }

      await refreshData();
      toast.success("Classe criada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar classe.");
    }
  };

  const handleDeleteClass = async (
    id: string,
    type: "product" | "supplier",
  ) => {
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
    <div className="flex flex-col h-full p-6">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as preferências e dados do seu negócio
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Aparência */}
          {/* <SettingsAppearanceCard
            receiveNotifications={receiveNotifications}
            setReceiveNotifications={setReceiveNotifications}
          /> */}
          {!isRetail && (
            <SettingsSaleModesCard
              saleModes={saleModes}
              setSaleModes={setSaleModes}
              totalTables={initialTables}
              openTableDrawer={() => setIsTableDrawerOpen(true)}
            />
          )}
          {/* Classes de Produtos - Sempre visível */}
          <SettingsDataClassesCard
            title="Classes de Produtos"
            icon={Tags}
            emptyIcon={Tags}
            emptyText="Nenhuma classe de produto cadastrada"
            countSuffix="produtos vinculados"
            classes={productClasses}
            onOpenDrawer={() => openClassDrawer("product")}
            onDeleteClass={(id) => handleDeleteClass(id, "product")}
          />
          {/* Classes de Fornecedores - Só mostra se NÃO for Retail */}
          <SettingsDataClassesCard
            title="Classes de Fornecedores"
            icon={Layers}
            emptyIcon={Layers}
            emptyText="Nenhuma classe de fornecedor cadastrada"
            countSuffix="fornecedores vinculados"
            classes={supplierClasses}
            onOpenDrawer={() => openClassDrawer("supplier")}
            onDeleteClass={(id) => handleDeleteClass(id, "supplier")}
          />
        </div>
      </div>

      <TableSettingsSheet
        isOpen={isTableDrawerOpen}
        onOpenChange={setIsTableDrawerOpen}
        initialTables={initialTables}
        onSave={handleSaveTables}
        isSaving={isSavingTables}
      />
      {/* Drawer de Criação de Classe */}
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

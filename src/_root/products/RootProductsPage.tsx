"use client";

import { Clock, Plus } from "lucide-react";

import { PageTabNavigation } from "../../components/shared/PageTabNavigation";
import { Button } from "../../components/ui/button";
import { productsTabs } from "../../lib/sidebarNavFilter";

import { CategoryProductSelector } from "../../components/shared/CategoryFilter";
import LoadingComponent from "../../components/shared/LoadingComponent";
import { SearchListPicker } from "../../components/shared/SearchListPicker";
import { useAuthenticatedUser } from "../../contexts/DataContext";
import { InventoryTable } from "../components/inventory/InventoryTable";
import EntryPage from "./components/EntryPage";
import { CreateItemSheet } from "./components/sheets/CreateItemSheet";
import { CreateProductSheet } from "./components/sheets/CreateProductSheet";
import { EditProductSheet } from "./components/sheets/EditProductSheet";
import {
  InventoryProvider,
  useInventoryContext,
} from "./hooks/InventoryContext";

function MenuContent() {
  const {
    activeView,
    setActiveView,
    isRetail,
    products,
    inventoryItems,
    isLoadingProducts,
    isLoadingInventory,
    setIsCreateProductOpen,
    setIsEditProductOpen,
    setIsCreateInventoryOpen,
    setSelectedProduct,
    handleUpdateInventoryItem,
  } = useInventoryContext();

  const filteredTabs = productsTabs.filter(
    (tab) =>
      tab.businessType === "ALL" ||
      tab.businessType === (isRetail ? "RETAIL" : "FOOD_AND_BEVERAGE"),
  );

  const { categories } = useAuthenticatedUser();

  const isLoading =
    isLoadingProducts || (activeView === "inventory" && isLoadingInventory);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col w-full h-full bg-background overflow-hidden gap-4">
      {/* Navegação de Abas */}
      <div className="flex h-14 items-center justify-between">
        <PageTabNavigation
          tabs={filteredTabs}
          activeTab={activeView}
          onTabChange={(id) => setActiveView(id as any)}
        />

        {activeView === "inventory" && (
          <Button onClick={() => setIsCreateInventoryOpen(true)}>
            <Plus size={18} strokeWidth={3} />
            Novo Item
          </Button>
        )}

        {activeView === "products" && (
          <Button onClick={() => setIsCreateProductOpen(true)}>
            <Plus size={20} />
            <span>Adicionar</span>
          </Button>
        )}

        {activeView === "entry-notes" && (
          <Button onClick={() => setIsCreateProductOpen(true)}>
            <Clock size={20} />
            <span>Historico</span>
          </Button>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-6 pb-6 bg-card rounded-xl custom-scrollbar">
        {activeView === "products" && (
          <div className="flex flex-col gap-4">
            <SearchListPicker
              items={products}
              onSelect={(item) => {
                setSelectedProduct(item);
                setIsEditProductOpen(true);
              }}
              placeholder="Buscar produto por nome, código ou categoria..."
              searchKeys={["name", "code", "category"]}
              avatarText={(item) => item.name.charAt(0).toUpperCase()}
              renderTitle={(item) => item.name}
              renderSubtitle={(item) =>
                `${
                  typeof item.category === "object"
                    ? item.category?.name
                    : item.category
                } • R$ ${Number(item.price).toFixed(2)}`
              }
            />
            <CategoryProductSelector
              categories={categories}
              products={products}
              onProductSelect={(item) => {
                setSelectedProduct(item);
                setIsEditProductOpen(true);
              }}
            />
          </div>
        )}

        {activeView === "inventory" && (
          <InventoryTable
            items={inventoryItems}
            onItemUpdated={handleUpdateInventoryItem}
          />
        )}

        {activeView === "entry-notes" && <EntryPage />}
      </div>

      {/* ==================== SHEETS ==================== */}

      {/* Criar Produto */}
      <CreateProductSheet />

      {/* Editar Produto */}
      <EditProductSheet />

      {/* Criar Item de Inventário */}
      <CreateItemSheet />
    </div>
  );
}

export default function RootMenuPage() {
  return (
    <InventoryProvider>
      <MenuContent />
    </InventoryProvider>
  );
}

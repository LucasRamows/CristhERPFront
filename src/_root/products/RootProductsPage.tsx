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

// Sheets Refatoradas
import { CreateItemSheet } from "./components/sheets/CreateItemSheet";
import { CreateProductSheet } from "./components/sheets/CreateProductSheet";
import { EditProductSheet } from "./components/sheets/EditProductSheet";

// Provedor e Hooks da Nova Arquitetura
import {
  InventoryProvider,
  useInventoryContext,
} from "./hooks/new/InventoryContext";

function MenuContent() {
  // Puxando apenas o que importa do nosso contexto segmentado
  const {
    activeView,
    setActiveView,
    isRetail,
    products,
    isLoadingProducts,
    isLoadingInventory,
    setActiveProduct,
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
          // O Botão agora é envelopado pelo Smart Component
          <CreateItemSheet>
            <Button>
              <Plus size={18} strokeWidth={3} />
              Novo Item
            </Button>
          </CreateItemSheet>
        )}

        {activeView === "products" && (
          // O Botão agora é envelopado pelo Smart Component
          <CreateProductSheet>
            <Button>
              <Plus size={20} /> Adicionar
            </Button>
          </CreateProductSheet>
        )}

        {activeView === "entry-notes" && (
          <Button onClick={() => console.log("Em breve: Modal de Histórico")}>
            <Clock size={20} />
            <span>Histórico</span>
          </Button>
        )}
      </div>

      {/* Conteúdo Central */}
      <div className="flex-1 overflow-y-auto p-6 pb-6 bg-card rounded-xl custom-scrollbar">
        {activeView === "products" && (
          <div className="flex flex-col gap-4">
            <SearchListPicker
              items={products}
              // A MÁGICA: Apenas setamos o produto ativo, e a gaveta reage sozinha!
              onSelect={(item) => setActiveProduct(item)}
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
              // A MÁGICA DE NOVO!
              onProductSelect={(item) => setActiveProduct(item)}
            />
          </div>
        )}

        {activeView === "inventory" && (
          <InventoryTable
          
          />
        )}

        {activeView === "entry-notes" && <EntryPage />}
      </div>

      {/* ==================== SHEETS (Ouvintes de Estado) ==================== */}
      
      {/* Esta gaveta não tem botão (trigger) físico, ela "ouve" a variável activeProduct. */}
      {/* Se houver um activeProduct, ela abre e preenche os dados. */}
      <EditProductSheet />

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
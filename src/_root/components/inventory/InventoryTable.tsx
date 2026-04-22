import { PackageX } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { SearchListPicker } from "../../../components/shared/SearchListPicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { type ItemResponse } from "../../../services/inventory/inventory.service";
import { useInventoryContext } from "../../products/hooks/new/InventoryContext";
import { InventoryHistorySheet } from "./InventoryHistorySheet";
import { InventoryItemCard } from "./InventoryItem/InventoryItemCard";

// O componente agora não precisa mais de props! É totalmente autônomo.
export function InventoryTable() {
  // 1. Puxamos a lista e as ações direto da nossa nova Fonte de Verdade
  const {
    inventoryItems,
    setActiveInventoryItem,
    setInventoryItems, // Usaremos para atualizar a lista se o histórico sofrer ajuste
  } = useInventoryContext();

  // 2. Estado local EXCLUSIVO para o modal de Histórico
  const [historyItem, setHistoryItem] = useState<ItemResponse | null>(null);

  // 3. Estado local de filtro
  const [statusFilter, setStatusFilter] = useState("ALL");

  // --- HANDLERS ---

  const handleItemClick = useCallback((item: ItemResponse) => {
    // Ao clicar no card, abre a gaveta de histórico
    setHistoryItem(item);
  }, []);

  const handleEditItem = useCallback((item: ItemResponse) => {
    // A MÁGICA: Avisamos o contexto global. A gaveta CreateItemSheet reage e abre!
    setActiveInventoryItem(item);
  }, [setActiveInventoryItem]);

  const handleHistoryAdjustment = useCallback((updatedItem: ItemResponse) => {
    // Se a aba de histórico fizer algum ajuste de estoque, atualizamos a UI global
    setInventoryItems((prev) =>
      prev.map((i) => (i.id === updatedItem.id ? updatedItem : i))
    );
    // Mantém o item atualizado na gaveta de histórico
    setHistoryItem(updatedItem);
  }, [setInventoryItems]);


  // --- FILTROS ---

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const currentStock = Number(item.currentStock || 0);
      const minStock = Number(item.minStock || 0);
      const hasMinStock = minStock > 0;
      const isLowStock = hasMinStock && currentStock <= minStock;

      let matchesStatus = true;
      if (statusFilter === "LOW") matchesStatus = isLowStock;
      if (statusFilter === "NORMAL") matchesStatus = hasMinStock && !isLowStock;
      if (statusFilter === "NO_MIN") matchesStatus = !hasMinStock;

      return matchesStatus;
    });
  }, [inventoryItems, statusFilter]);

  return (
    <div className="animate-in fade-in duration-500 space-y-6 bg-card rounded-xl h-full">
      {/* 1. HEADER & SEARCH */}
      <div className="w-full flex gap-2">
        <SearchListPicker
          items={inventoryItems}
          onSelect={handleItemClick}
          placeholder="Digite o nome ou referência do insumo aqui..."
          searchKeys={["name", "code"]}
          avatarText={(item) => item.name.charAt(0).toUpperCase()}
          renderTitle={(item) => item.name}
          renderSubtitle={(item) => (
            <div className="flex items-center gap-2">
              <span className="font-bold">Ref: {item.code || "N/A"}</span>
              <span className="text-muted-foreground opacity-60">
                • Estoque {item.currentStock} {item.unit}
              </span>
            </div>
          )}
        />
        {/* Filtros de Navegação */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-45 bg-background rounded-lg">
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os Itens</SelectItem>
              <SelectItem value="LOW">Estoque Baixo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 2. GRID DE CARDS */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <InventoryItemCard
              key={item.id}
              item={item}
              onClick={handleItemClick}
              onEdit={handleEditItem}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-card border border-border rounded-xl border-dashed">
          <PackageX className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-lg font-medium text-foreground">
            Nenhum insumo encontrado
          </p>
          <p className="text-sm opacity-70 mt-1">
            Tente ajustar seus filtros de busca ou limpe a pesquisa.
          </p>
        </div>
      )}

      {/* 3. MODAL DE HISTÓRICO (Fica local pois é apenas dessa visualização) */}
      <InventoryHistorySheet
        item={historyItem}
        isOpen={!!historyItem} // Abre se houver um item selecionado
        onClose={() => setHistoryItem(null)} // Fecha limpando o estado
        onAdjusted={handleHistoryAdjustment}
      />
      

    </div>
  );
}
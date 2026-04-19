import { PackageX } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { SearchListPicker } from "../../../components/shared/SearchListPicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { type ItemResponse } from "../../../services/inventory/inventory.service";
import { CreateItemSheet } from "../../products/components/sheets/CreateItemSheet";
import { InventoryHistorySheet } from "./InventoryHistorySheet";
import { InventoryItemCard } from "./InventoryItem/InventoryItemCard";

interface InventoryTableProps {
  items: ItemResponse[];
  onItemUpdated?: (item: ItemResponse) => void;
}

export function InventoryTable({
  items: initialItems,
  onItemUpdated,
}: InventoryTableProps) {
  const [selectedItem, setSelectedItem] = useState<ItemResponse | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      const updated = initialItems.find((i) => i.id === selectedItem.id);
      if (updated) setSelectedItem(updated);
    }
  }, [initialItems, selectedItem?.id]);

  const [editingItem, setEditingItem] = useState<ItemResponse | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleItemClick = useCallback((item: ItemResponse) => {
    setSelectedItem(item);
    setIsHistoryOpen(true);
  }, []);

  const handleEditItem = useCallback((item: ItemResponse) => {
    setEditingItem(item);
    setIsEditSheetOpen(true);
  }, []);

  const handleSuccess = (updatedItem: ItemResponse) => {
    onItemUpdated?.(updatedItem);

    setSelectedItem((current) =>
      current?.id === updatedItem.id ? updatedItem : current,
    );
  };

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
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
  }, [initialItems, statusFilter]);

  return (
    <div className="animate-in fade-in duration-500 space-y-6 bg-card rounded-xl h-full">
      <div className="w-full flex gap-2">
        <SearchListPicker
          items={initialItems}
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
        /* Empty State (Caso a busca não encontre nada) */
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

      {/* MODAL DE HISTÓRICO (Mantido intacto) */}
      <InventoryHistorySheet
        item={selectedItem}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onAdjusted={handleSuccess}
      />

      {/* MODAL DE EDIÇÃO / CRIAÇÃO */}
      <CreateItemSheet
        isOpen={isEditSheetOpen}
        onClose={() => {
          setIsEditSheetOpen(false);
          setEditingItem(null);
        }}
        activeItem={editingItem}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

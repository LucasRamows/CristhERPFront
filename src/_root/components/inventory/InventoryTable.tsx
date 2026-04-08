import { useCallback, useState } from "react";
import { SearhListPicker } from "../../../components/shared/SearhListPicker";
import { type IngredientResponse } from "../../../services/inventory/inventory.service";
import { InventoryHistorySheet } from "./InventoryHistorySheet";
import { InventoryTableRow } from "./InventoryTableRow";

interface InventoryTableProps {
  items: IngredientResponse[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const [selectedItem, setSelectedItem] = useState<IngredientResponse | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleItemClick = useCallback((item: IngredientResponse) => {
    setSelectedItem(item);
    setIsSheetOpen(true);
  }, []);

  return (
    <div className="p-4 mx-auto animate-in fade-in duration-500 select-none">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex w-full">
          <SearhListPicker
            items={items}
            onSelect={handleItemClick}
            placeholder="Buscar insumo por nome..."
            searchKeys={["name"]}
            avatarText={(item) => item.name.charAt(0).toUpperCase()}
            renderTitle={(item) => item.name}
            renderSubtitle={(item) => (
              <>
                {item.currentStock} {item.unit}{" "}
                {Number(item.minStock || 0) > 0 &&
                  `• Mínimo ${item.minStock} ${item.unit}`}
              </>
            )}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-[44px] border border-zinc-100 dark:border-zinc-900 overflow-hidden animate-in zoom-in-95 duration-500 shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-50 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Insumo / Matéria-Prima</th>
                <th className="px-6 py-6 text-center">Nível Atual</th>
                <th className="px-6 py-6 text-center">Estoque Mínimo</th>
                <th className="px-6 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
              {items.map((item) => (
                <InventoryTableRow
                  key={item.id}
                  item={item}
                  onClick={handleItemClick}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <InventoryHistorySheet
        item={selectedItem}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  );
}

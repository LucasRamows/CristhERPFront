import { History, Package } from "lucide-react";
import { useState } from "react";
import { SearhListPicker } from "../../../components/shared/SearhListPicker";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { type IngredientResponse } from "../../../services/inventory/inventory.service";
import { InventoryHistorySheet } from "./InventoryHistorySheet";

interface InventoryTableProps {
  items: IngredientResponse[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const [selectedItem, setSelectedItem] = useState<IngredientResponse | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleItemClick = (item: IngredientResponse) => {
    setSelectedItem(item);
    setIsSheetOpen(true);
  };


  return (
    <div className="p-4 mx-auto animate-in fade-in duration-500 select-none">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex w-full">
          <SearhListPicker
            items={items}
            onSelect={(item) => handleItemClick(item)}
            placeholder="Buscar insumo por nome..."
            searchKeys={["name"]}
            renderItem={(item) => (
              <div className="flex items-center gap-3 py-1 text-left">
                <Avatar className="h-10 w-10 border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 overflow-hidden shrink-0 transition-transform group-hover:scale-110">
                  <AvatarFallback className="font-black text-xs text-primary bg-primary/10 w-full h-full flex items-center justify-center">
                    {item.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="font-black text-sm text-zinc-800 dark:text-zinc-200 truncate">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    {item.currentStock} {item.unit} • Mínimo {item.minStock}{" "}
                    {item.unit}
                  </span>
                </div>
              </div>
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
              {items.map((item) => {
                const isLowStock = item.currentStock <= item.minStock;
                const progress =
                  item.minStock > 0
                    ? Math.min((item.currentStock / item.minStock) * 100, 100)
                    : 100;

                return (
                  <tr
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-all group cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div
                          className={`w-12 h-12 rounded-[20px] flex items-center justify-center border-2 transition-transform group-hover:scale-110 duration-500 ${
                            isLowStock
                              ? "bg-red-500/5 border-red-500/20 text-red-500"
                              : "bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-400"
                          }`}
                        >
                          <Package size={22} />
                        </div>
                        <div>
                          <p className="font-black text-zinc-900 dark:text-zinc-100 text-lg leading-none mb-1 tracking-tighter uppercase">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-bold tracking-[0.15em] uppercase opacity-60">
                            ID: #{item.id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span
                          className={`font-black text-2xl tracking-tighter ${
                            isLowStock
                              ? "text-red-500"
                              : "text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
                          {item.currentStock}{" "}
                          <span className="text-[10px] font-bold uppercase opacity-40 ml-1">
                            {item.unit}
                          </span>
                        </span>
                        <div className="w-24 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-1000 ${
                              isLowStock ? "bg-red-500" : "bg-primary"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center font-black text-zinc-500 dark:text-zinc-400 text-lg tracking-tighter">
                      {item.minStock}{" "}
                      <span className="text-[10px] opacity-40 uppercase ml-0.5">
                        {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span
                        className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ${
                          isLowStock
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {isLowStock ? "Estoque Baixo" : "Normal"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(item);
                        }}
                        className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 hover:text-primary hover:border-primary/50 transition-all active:scale-95 flex items-center justify-center shadow-sm"
                      >
                        <History size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
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

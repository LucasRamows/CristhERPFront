import { History, Package } from "lucide-react";
import { memo } from "react";
import { type IngredientResponse } from "../../../services/inventory/inventory.service";

interface InventoryTableRowProps {
  item: IngredientResponse;
  onClick: (item: IngredientResponse) => void;
}

export const InventoryTableRow = memo(
  ({ item, onClick }: InventoryTableRowProps) => {
    // Converte para Number para evitar falsos-positivos na validação ("10" <= "5" retorna true na comparação de strings)
    const currentStock = Number(item.currentStock || 0);
    const minStock = Number(item.minStock || 0);
    
    const hasMinStock = minStock > 0;
    const isLowStock = hasMinStock && currentStock <= minStock;
    const progress = hasMinStock
      ? Math.min((currentStock / minStock) * 100, 100)
      : 100;

    return (
      <tr
        onClick={() => onClick(item)}
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
                isLowStock ? "text-red-500" : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {currentStock}{" "}
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
          {hasMinStock ? (
            <>
              {minStock}{" "}
              <span className="text-[10px] opacity-40 uppercase ml-0.5">
                {item.unit}
              </span>
            </>
          ) : (
            <span className="text-sm opacity-50">-</span>
          )}
        </td>
        <td className="px-6 py-6 text-center">
          <span
            className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ${
              isLowStock
                ? "bg-red-500/10 text-red-600 dark:text-red-400"
                : !hasMinStock
                ? "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {isLowStock
              ? "Estoque Baixo"
              : !hasMinStock
              ? "Sem Mínimo"
              : "Normal"}
          </span>
        </td>
        <td className="px-8 py-6 text-right">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(item);
            }}
            title="Ver Histórico e Ajustar Estoque"
            className="px-4 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 hover:text-primary hover:border-primary/50 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase text-[10px] font-black tracking-widest group-hover:border-primary/30 group-hover:text-primary shadow-sm"
          >
            <History size={15} />
            <span className="hidden opacity-0 group-hover:opacity-100 sm:inline transition-opacity duration-300">
              Detalhes
            </span>
          </button>
        </td>
      </tr>
    );
  },
);

InventoryTableRow.displayName = "InventoryTableRow";

import { ChevronRight } from "lucide-react";
import type { ProductsResponse } from "../../../services/products/products.service";

interface ProductCardProps {
  item: ProductsResponse;
  icon: React.ReactNode;
  onClick: (item: ProductsResponse) => void;
  formatMoney: (value: number) => string;
}

export const ProductCard = ({
  item,
  icon: Icon,
  onClick,
  formatMoney,
}: ProductCardProps) => {
  return (
    <div
      onClick={() => onClick(item)}
      className="group flex flex-col bg-white dark:bg-[#25262b] p-6 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer relative overflow-hidden border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 h-full min-h-[280px]"
    >
      {/* Indicador de Status Colorido no topo */}
      {item.status && (
        <div className="absolute top-0 left-0 w-full h-2 bg-[#DCFF79] dark:bg-[#cbe665]" />
      )}

      <div className="flex items-start justify-between gap-4 py-3 mt-1 flex-1">
        <div className="flex flex-col flex-1">
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-bold tracking-wider uppercase h-4">
            {item.category}
          </p>

          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-xl leading-tight mt-1 mb-2 tracking-tight line-clamp-2 min-h-14">
            {item.name}
          </h3>

          <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2 leading-relaxed min-h-14">
            {item.description}
          </p>
        </div>

        <div
          className={`w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 bg-zinc-50 dark:bg-zinc-800/30`}
        >
          {Icon}
        </div>
      </div>

      <div className="mt-4 pt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mb-0.5">
            Preço
          </span>
          <span className="text-zinc-900 dark:text-zinc-100 text-xl font-bold tracking-tight">
            {formatMoney(Number(item.price))}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mb-0.5">
              Status
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide transition-colors ${
                item.status
                  ? "bg-[#DCFF79]/30 text-zinc-800 dark:text-zinc-200"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
              }`}
            >
              {item.status ? "Ativo" : "Inativo"}
            </span>
          </div>

          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500 group-hover:bg-[#DCFF79]/20 group-hover:text-zinc-900 dark:group-hover:text-[#DCFF79] transition-all shrink-0">
            <ChevronRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

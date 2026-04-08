import { ChevronRight } from "lucide-react";
import type { ProductsResponse } from "../../../services/products/products.service";

interface ProductCardProps {
  item: ProductsResponse;
  onClick: (item: ProductsResponse) => void;
  formatMoney: (value: number) => string;
}

export const ProductCard = ({
  item,
  onClick,
  formatMoney,
}: ProductCardProps) => {
  return (
    <div
      onClick={() => onClick(item)}
      className="card-default p-4 group flex flex-col justify-between hover:border-border hover:shadow-md transition-all cursor-pointer relative overflow-hidden min-h-[110px]"
    >
      {/* Linha de status sutil no topo */}
      {item.status && (
        <div className="absolute top-0 left-0 w-full h-1 rounded-md bg-decoration" />
      )}

      {/* Cabeçalho: Categoria, Nome e Ícone */}
      <div className="flex items-start justify-between gap-3 mt-1">
        <div className="flex flex-col overflow-hidden">
          <p className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase truncate">
            {item.category?.name}
          </p>
          <h3 className="font-bold text-foreground text-sm leading-tight mt-1 truncate">
            {item.name}
          </h3>
        </div>

        <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 bg-muted/50 text-muted-foreground group-hover:scale-110 group-hover:bg-decoration/10 group-hover:text-foreground transition-all">
          <span className="font-bold text-xs">
            {item.category?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Rodapé: Preço e Ação */}
      <div className="mt-3 flex items-end justify-between border-t border-border/50 pt-3">
        <div className="flex flex-col">
          <span className="text-foreground text-base font-black tracking-tight">
            {formatMoney(Number(item.price))}
          </span>
          {/* O status ativo/inativo virou um texto sutil para poupar espaço */}
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              item.status ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {item.status ? "• Ativo" : "• Inativo"}
          </span>
        </div>

        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-background border border-border text-muted-foreground group-hover:bg-decoration group-hover:border-decoration group-hover:text-[#121212] transition-all shrink-0">
          <ChevronRight size={14} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};

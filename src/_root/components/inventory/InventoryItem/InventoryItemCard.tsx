import { History, Package, Pencil } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/card"; // Ajuste o caminho se necessário
import { type ItemResponse } from "../../../../services/inventory/inventory.service";

interface InventoryItemCardProps {
  item: ItemResponse;
  onClick: (item: ItemResponse) => void;
  onEdit: (item: ItemResponse) => void;
}

export function InventoryItemCard({
  item,
  onClick,
  onEdit,
}: InventoryItemCardProps) {
  // Lógica de cálculo de estoque
  const currentStock = Number(item.currentStock || 0);
  const minStock = Number(item.minStock || 0);
  const hasMinStock = minStock > 0;
  const isLowStock = hasMinStock && currentStock <= minStock;
  const progress = hasMinStock
    ? Math.min((currentStock / minStock) * 100, 100)
    : 100;

  const isProduct = item.productRecipes?.length || 0 > 0;
  // Definição semântica de cores com base no status
  let statusColor = "bg-emerald-500";
  let statusText = "text-emerald-500";
  let statusLabel = "Estoque Normal";

  if (isLowStock) {
    statusColor = "bg-destructive";
    statusText = "text-destructive";
    statusLabel = "Estoque Baixo";
  } else if (!hasMinStock) {
    statusColor = "bg-muted-foreground";
    statusText = "text-muted-foreground";
    statusLabel = "Sem Mínimo";
  }

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden rounded-xl cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200">
      {/* Alerta Visual no Topo se o estoque estiver baixo */}
      {isLowStock && (
        <div className="absolute top-0 left-0 w-full h-1 bg-destructive" />
      )}

      <CardContent className="p-4 flex flex-col h-full gap-4">
        {/* Cabeçalho: ID, Nome e Ícone */}
        <div
          className="flex items-start justify-between gap-3"
          onClick={() => onClick(item)}
        >
          <div className="flex flex-col overflow-hidden">
            <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase truncate opacity-70">
              Ref: {item.code || "N/A"}
            </p>
            <h3 className="font-bold text-foreground text-sm leading-tight mt-1 truncate">
              {item.name}
            </h3>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
              isLowStock
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            }`}
          >
            <Package size={20} />
          </div>
        </div>

        {/* Informações de Estoque (Números e Barra) */}
        <div className="flex flex-col gap-2 mt-2" onClick={() => onClick(item)}>
          <div className="flex items-end justify-between">
            <span
              className={`font-black text-2xl tracking-tighter ${
                isLowStock ? "text-destructive" : "text-foreground"
              }`}
            >
              {currentStock}{" "}
              <span className="text-xs font-bold uppercase opacity-50 ml-0.5">
                {item.unit}
              </span>
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Mín: {hasMinStock ? minStock : "-"}
            </span>
          </div>

          {/* Mini Barra de Progresso */}
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                isLowStock ? "bg-destructive" : "bg-primary"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Rodapé: Indicador de Status e Botão de Ação */}
        <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${statusText}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusColor}`}
            />
            {statusLabel}
          </span>

          <div className="flex items-center gap-2">
            {!isProduct && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-background border border-border text-muted-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all shrink-0"
              >
                <Pencil size={14} strokeWidth={2.5} />
              </button>
            )}
            <div
              onClick={() => onClick(item)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-background border border-border text-muted-foreground group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all shrink-0"
            >
              <History size={14} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

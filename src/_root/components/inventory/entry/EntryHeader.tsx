import { CheckCircle, ShoppingCart } from "lucide-react";
import { formatMoney } from "../../../../lib/utils";

interface Props {
  isLoading: boolean;
  handleSave: () => void;
  itemsCount: number;
  total: number;
  onCancel: () => void;
}

export function EntryHeader({
  isLoading,
  handleSave,
  itemsCount,
  total,
  onCancel,
}: Props) {
  return (
    <header className="shrink-0 px-4 sm:px-6 py-3.5 bg-card border-b border-border flex items-center justify-between gap-3">
      <button
        onClick={onCancel}
        className="px-5 py-2 rounded-full text-sm font-bold text-muted-foreground hover:bg-muted transition-all"
      >
        Cancelar
      </button>

      <div className="flex items-center gap-2">
        {itemsCount > 0 && (
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-wider">
            <ShoppingCart size={12} /> {itemsCount}{" "}
            {itemsCount === 1 ? "item" : "itens"} · {formatMoney(total)}
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isLoading || itemsCount === 0}
          className="px-6 py-2.5 bg-foreground text-background rounded-full font-black text-xs tracking-wide hover:shadow-lg hover:-translate-y-px transition-all flex items-center gap-2 disabled:opacity-40 disabled:translate-y-0 disabled:shadow-none"
        >
          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-background border-t-transparent animate-spin rounded-full" />
          ) : (
            <CheckCircle size={15} />
          )}
          {isLoading ? "Processando…" : "Confirmar Entrada"}
        </button>
      </div>
    </header>
  );
}

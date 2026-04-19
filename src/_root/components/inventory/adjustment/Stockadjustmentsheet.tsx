import {
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Scale,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { type ItemResponse } from "../../../../services/inventory/inventory.service";
import { InventoryQuantityInput } from "../InventoryQuantityInput";

// ─── Props ────────────────────────────────────────────────────────────────────

interface StockAdjustmentSheetProps {
  item: ItemResponse | null;
  isOpen: boolean;
  onClose: () => void;
  /** Called after the user confirms — adjust your service call here. */
  onConfirm: (
    item: ItemResponse,
    newStock: number,
    delta: number,
  ) => Promise<void>;
}

// ─── Delta pill ───────────────────────────────────────────────────────────────

function DeltaPill({ delta }: { delta: number }) {
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] bg-muted text-muted-foreground">
        Sem alteração
      </span>
    );
  }

  const isPositive = delta > 0;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ${
        isPositive
          ? "bg-emerald-500/10 text-emerald-500"
          : "bg-destructive/10 text-destructive"
      }`}
    >
      {isPositive ? <ArrowUpCircle size={10} /> : <ArrowDownCircle size={10} />}
      {isPositive ? `+${delta}` : delta}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function StockAdjustmentSheet({
  item,
  onClose,
  onConfirm,
}: StockAdjustmentSheetProps) {
  const [newStock, setNewStock] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setNewStock(null);
        setIsDone(false);
        setIsLoading(false);
        onClose();
      }
    },
    [onClose],
  );

  const delta = useMemo(() => {
    if (newStock === null || !item) return null;
    return parseFloat((newStock - item.currentStock).toFixed(4));
  }, [newStock, item]);

  const canConfirm =
    newStock !== null &&
    delta !== null &&
    delta !== 0 &&
    !isLoading;

  const handleConfirm = useCallback(async () => {
    if (
      !item ||
      newStock === null ||
      delta === null
    )
      return;
    setIsLoading(true);
    try {
      await onConfirm(item, newStock, delta);
      setIsDone(true);
      setTimeout(() => handleOpenChange(false), 1400);
    } finally {
      setIsLoading(false);
    }
  }, [item, newStock, delta, onConfirm, handleOpenChange]);

  if (!item) return null;

  const isPositive = delta !== null && delta > 0;
  const isNegative = delta !== null && delta < 0;

  return (
    <div className="w-full flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Header ── */}
      <div className="py-3 border-b border-border bg-background/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[20px] bg-card border border-border flex items-center justify-center text-muted-foreground">
              <Scale size={22} />
            </div>
            <div>
              <h3 className="font-black text-foreground text-lg tracking-tighter uppercase leading-none mb-1">
                Ajuste de Estoque
              </h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em]">
                {item.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenChange(false)}
            className="w-8 h-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 transition-all active:scale-95"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="px-8 py-6 flex flex-col gap-6">
        {/* ── Current stock card ── */}
        <div className="bg-card rounded-[24px] border border-border p-5">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">
            Estoque Atual
          </p>
          <div className="flex items-end gap-2">
            <span className="font-black text-4xl tracking-tighter text-foreground">
              {item.currentStock}
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase pb-1">
              {item.unit}
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                item.currentStock <= item.minStock
                  ? "bg-destructive"
                  : "bg-primary"
              }`}
              style={{
                width: `${Math.min(
                  item.minStock > 0
                    ? (item.currentStock / item.minStock) * 100
                    : 100,
                  100,
                )}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-2">
            Mínimo: {item.minStock} {item.unit}
          </p>
        </div>

        {/* ── New value input ── */}
        <div className="bg-card rounded-[24px] border border-border p-5">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">
            Novo Valor
          </p>
          <div className="flex items-end gap-2">
            <InventoryQuantityInput
              unit={item.unit}
              value={newStock}
              onChange={(val) => setNewStock(val)}
              disabled={isLoading || isDone}
              placeholder={String(item.currentStock)}
              className="w-full"
            />
          </div>
        </div>

        {/* ── Delta preview ── */}
        {delta !== null && (
          <div
            className={`relative rounded-[24px] border p-5 overflow-hidden transition-all duration-300 ${
              isPositive
                ? "bg-emerald-500/5 border-emerald-500/20"
                : isNegative
                ? "bg-destructive/5 border-destructive/20"
                : "bg-card border-border"
            }`}
          >
            {/* decorative blob */}
            <div
              className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 opacity-30 ${
                isPositive
                  ? "bg-emerald-500"
                  : isNegative
                  ? "bg-destructive"
                  : "bg-muted-foreground/30"
              }`}
            />

            <div className="relative z-10">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">
                Resumo do Balanço
              </p>

              <div className="flex items-center justify-between">
                {/* before → after */}
                <div className="flex items-center gap-3">
                  <span className="font-black text-xl tracking-tighter text-muted-foreground line-through">
                    {item.currentStock}
                  </span>
                  <span className="text-muted-foreground/50 text-lg">→</span>
                  <span
                    className={`font-black text-2xl tracking-tighter ${
                      isPositive
                        ? "text-emerald-500"
                        : isNegative
                        ? "text-destructive"
                        : "text-foreground"
                    }`}
                  >
                    {newStock}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    {item.unit}
                  </span>
                </div>

                {/* delta pill */}
                <DeltaPill delta={delta} />
              </div>

              {/* movement type label */}
              <div className="mt-3 flex items-center gap-2">
                {isPositive ? (
                  <ArrowUpCircle size={12} className="text-emerald-500" />
                ) : isNegative ? (
                  <ArrowDownCircle size={12} className="text-destructive" />
                ) : null}
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {isPositive
                    ? `Acréscimo de ${Math.abs(delta)} ${item.unit}`
                    : isNegative
                    ? `Retirada de ${Math.abs(delta)} ${item.unit}`
                    : "Valor igual ao estoque atual"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
            className="flex-1 py-4 rounded-[20px] border border-border text-xs font-black uppercase tracking-[0.15em] text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground transition-all active:scale-95 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`flex-2 py-4 rounded-[20px] text-xs font-black uppercase tracking-[0.15em] transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isDone
                ? "bg-emerald-500 text-white"
                : canConfirm
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isDone ? (
              <>
                <CheckCircle2 size={14} />
                Ajustado!
              </>
            ) : isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Confirmar Balanço"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

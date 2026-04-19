import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Hash,
  History,
  Scale,
  User
} from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { type InventoryMovement } from "../../../../services/inventory/inventory.service";

interface HistorySectionProps {
  title: string;
  items: InventoryMovement[];
  selectedUnit: string;
}

export function HistorySection({
  title,
  items,
  selectedUnit,
}: HistorySectionProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-4">
        <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center border border-border">
          <History size={36} className="opacity-30" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">
            Nenhuma movimentação registrada
          </p>
          <p className="text-sm mt-1">As movimentações aparecerão aqui</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h3 className="text-xs font-black uppercase tracking-[0.125em] text-muted-foreground pl-1">
        {title}
      </h3>

      {items.map((movement) => {
        const isIn = movement.type === "IN";
        const isOut = movement.type === "OUT";
        const isBalance = movement.type === "ADJUST";

        // Configuração visual por tipo (Balanço é independente)
        const style = isBalance
          ? {
              iconColor: "text-violet-600 dark:text-violet-400",
              iconBg: "bg-violet-500/10",
              accentBg: "bg-violet-500/5",
              badgeColor:
                "bg-violet-500/10 text-violet-600 dark:text-violet-400",
              label: "BALANÇO",
            }
          : isIn
          ? {
              iconColor: "text-emerald-600 dark:text-emerald-400",
              iconBg: "bg-emerald-500/10",
              accentBg: "bg-emerald-500/5",
              badgeColor:
                "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              label: "ENTRADA",
            }
          : {
              iconColor: "text-destructive",
              iconBg: "bg-destructive/10",
              accentBg: "bg-destructive/5",
              badgeColor: "bg-destructive/10 text-destructive",
              label: "SAÍDA",
            };

        const quantityDisplay = isBalance
          ? movement.quantity
          : isIn
          ? `+${movement.quantity}`
          : `-${movement.quantity}`;

        return (
          <div
            key={movement.id}
            className="group relative bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Círculo decorativo de fundo */}
            <div
              className={`absolute top-0 right-0 w-28 h-28 ${style.accentBg} rounded-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-110`}
            />

            <div className="relative z-10">
              {/* Cabeçalho: Ícone + Quantidade + Badge */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300 ${style.iconBg} ${style.iconColor}`}
                  >
                    {isBalance ? (
                      <Scale size={28} strokeWidth={2.5} />
                    ) : isIn ? (
                      <ArrowUpCircle size={28} strokeWidth={2} />
                    ) : (
                      <ArrowDownCircle size={28} strokeWidth={2} />
                    )}
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`text-3xl font-black tracking-tighter ${style.iconColor}`}
                      >
                        {quantityDisplay}
                      </span>
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        {selectedUnit || "un"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Calendar size={13} />
                      {formatDate(movement.createdAt)}
                    </div>
                  </div>
                </div>

                <Badge
                  className={`font-black text-xs px-3 py-1 border-0 shadow-sm ${style.badgeColor}`}
                >
                  {style.label}
                </Badge>
              </div>

              {/* Informações adicionais */}
              <div className="mt-6 pt-5 border-t border-border/60 space-y-3 text-[13px]">
                {isIn && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-2 font-medium">
                        <User size={15} className="text-primary" /> Fornecedor
                      </span>
                      <span className="font-semibold truncate max-w-[220px] text-right">
                        {movement.supplier?.name || "—"}
                      </span>
                    </div>
                  </>
                )}

                {isBalance && (
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground flex items-center gap-2 font-medium">
                      <Scale size={15} className="text-primary" /> Tipo
                    </span>
                    <span className="font-semibold text-violet-600 dark:text-violet-400">
                      Ajuste Manual de Estoque
                    </span>
                  </div>
                )}

                {isOut && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2 font-medium">
                      <Hash size={15} className="text-primary" /> Motivo
                    </span>
                    <span className="font-medium text-right">
                      {movement.reason || "Consumo interno / Venda"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

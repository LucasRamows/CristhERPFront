import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  FileText,
  Hash,
  History,
  User,
} from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { type InventoryMovement } from "../../../../services/inventory/inventory.service";
import { formatDocument } from "../../../../lib/utils";

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
    console.log("itens", items);
    try {
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateString));
    } catch (e) {
      return dateString;
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center border border-border">
          <History size={32} className="opacity-20" />
        </div>
        <p className="font-bold text-sm">Nenhuma movimentação registrada</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 text-left">
      <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
        {title}
      </h3>
      {items.map((movement) => (
        <div
          key={movement.id}
          className="group relative bg-card border border-border rounded-[24px] p-5 hover:border-primary/20 hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          {movement.type === "IN" ? (
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 opacity-50 transition-all group-hover:scale-110" />
          ) : (
            <div className="absolute top-0 right-0 w-24 h-24 bg-destructive/5 rounded-full -mr-12 -mt-12 opacity-50 transition-all group-hover:scale-110" />
          )}

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4 gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500 ${
                    movement.type === "IN"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {movement.type === "IN" ? (
                    <ArrowUpCircle size={24} />
                  ) : (
                    <ArrowDownCircle size={24} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-foreground text-lg leading-tight tracking-tight truncate">
                    {movement.type === "IN"
                      ? `+ ${movement.quantity}`
                      : `- ${movement.quantity}`}{" "}
                    <span className="text-[10px] text-muted-foreground font-bold uppercase ml-1 opacity-60">
                      {selectedUnit || "un"}
                    </span>
                  </h4>
                  <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 mt-1 uppercase tracking-wider truncate">
                    <Calendar size={10} className="text-primary" />{" "}
                    {formatDate(movement.createdAt)}
                  </p>
                </div>
              </div>
              <Badge
                className={`font-black text-[9px] tracking-[0.15em] px-2 py-0.5 border-none shadow-sm shrink-0 whitespace-nowrap ${
                  movement.type === "IN"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {movement.type === "IN" ? "ENTRADA" : "SAÍDA"}
              </Badge>
            </div>

            <div className="space-y-2 pt-4 border-t border-border/50">
              {movement.type === "IN" ? (
                <>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground font-bold flex items-center gap-2 uppercase tracking-tight">
                      <User size={12} className="text-primary" /> Fornecedor
                    </span>
                    <span className="text-foreground font-black truncate max-w-[200px]">
                      {movement.supplier.name || "---"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground font-bold flex items-center gap-2 uppercase tracking-tight">
                      <FileText size={12} className="text-primary" /> CPF/CNPJ
                    </span>
                    <span className="text-foreground font-black">
                      {formatDocument(movement.supplier.identification) ||
                        "---"}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground font-bold flex items-center gap-2 uppercase tracking-tight">
                      <Hash size={12} className="text-primary" /> Motivo / Ref
                    </span>
                    <span className="text-foreground font-black">
                      {movement.reason || "Consumo de Venda"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import {
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Fingerprint,
  Calendar,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import type { SupplierResponse } from "../../../services/suppliers/suppliers.service";

interface SupplierCardProps {
  supplier: SupplierResponse;
  onDelete: (id: string) => void;
  onClick?: () => void;
}

export function SupplierCard({
  supplier,
  onDelete,
  onClick,
}: SupplierCardProps) {
  const address = supplier.addresses?.[0];
  return (
    <div
      onClick={onClick}
      className="group bg-card dark:bg-zinc-900 border border-border p-6 rounded-xl flex flex-col gap-5 hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer relative overflow-hidden animate-in fade-in slide-in-from-bottom-2"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-5 min-w-0">
          {/* Avatar */}
          <div
            className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center font-black text-xl shadow-inner transition-all group-hover:scale-105 duration-300 ${
              supplier.category === "Alimentos"
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-primary/10 text-primary"
            }`}
          >
            {supplier.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-foreground text-lg tracking-tight truncate group-hover:text-primary transition-colors">
                {supplier.name}
              </h3>
              <Badge
                variant="outline"
                className="px-1.5 py-0 h-4 text-[9px] font-black uppercase tracking-tighter border-border bg-muted/50 text-muted-foreground"
              >
                {supplier.category || "Geral"}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground/60 text-[11px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <Phone size={10} className="text-primary" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail size={10} className="text-primary" />
                <span className="lowercase">{supplier.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions (Sempre visíveis no topo direito) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(supplier.id);
            }}
            className="w-9 h-9 bg-muted dark:bg-zinc-800 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-white transition-all active:scale-90"
          >
            <Trash2 size={14} />
          </button>
          <div className="w-9 h-9 bg-primary/5 group-hover:bg-primary rounded-xl flex items-center justify-center text-primary group-hover:text-primary-foreground transition-all">
            <ChevronRight
              size={18}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </div>
        </div>
      </div>

      {/* Seção Inferior: Endereço e Metadados */}
      <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {supplier.addresses && (
          <div className="flex items-start gap-2 max-w-md">
            <MapPin size={12} className="text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-muted-foreground leading-tight">
                {address?.street}, {address?.streetNumber}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tighter">
                {address?.neighborhood} • {address?.city}/{address?.uf}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-muted-foreground/30 text-[9px] font-bold uppercase tracking-widest">
            <Fingerprint size={10} />
            <span>{supplier.identification}</span>
          </div>
          {supplier.createdAt && (
            <div className="flex items-center gap-1.5 text-muted-foreground/30 text-[9px] font-bold uppercase tracking-widest">
              <Calendar size={10} />
              <span>{new Date(supplier.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

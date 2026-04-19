import {
  Briefcase,
  Building2,
  Calendar,
  FileText,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { formatDocument } from "../../../../lib/utils";
import { SearchListPicker } from "../../../../components/shared/SearchListPicker";
import type { SupplierResponse } from "../../../../services/suppliers/suppliers.service";

interface Props {
  availableSuppliers: SupplierResponse[];
  selectedSupplier: SupplierResponse | null;
  setSelectedSupplier: (s: SupplierResponse | null) => void;
  docRef: string;
  setDocRef: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
}

export function EntryMetaData({
  availableSuppliers,
  selectedSupplier,
  setSelectedSupplier,
  docRef,
  setDocRef,
  date,
  setDate,
}: Props) {
  return (
    <div className="bg-card border border-border rounded-[28px] p-5 space-y-4">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
        Dados da Nota
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Supplier */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] px-1">
            Fornecedor
          </label>
          {selectedSupplier ? (
            <div className="group flex items-center justify-between w-full h-11 pl-3.5 pr-2 bg-foreground text-background rounded-2xl shadow-sm animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 overflow-hidden">
                <Building2 size={16} className="opacity-70 shrink-0" />
                <span className="font-bold text-sm truncate">
                  {selectedSupplier.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedSupplier(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-background/20 hover:bg-destructive hover:text-destructive-foreground transition-all shrink-0"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <SearchListPicker
              items={availableSuppliers}
              onSelect={setSelectedSupplier}
              placeholder="Buscar fornecedor…"
              searchKeys={["name", "identification"]}
              avatarText={(item) => item.name.charAt(0).toUpperCase()}
              renderTitle={(item) => item.name}
            />
          )}
        </div>

        {/* Doc ref */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] px-1">
            Nº Documento
          </label>
          <div className="relative">
            <FileText
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              value={docRef}
              onChange={(e) => setDocRef(e.target.value)}
              placeholder="Ex: 598210"
              className="w-full h-11 pl-9 pr-4 bg-muted border border-border rounded-2xl focus:bg-background focus:border-foreground/30 outline-none transition-all font-semibold text-sm"
            />
          </div>
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] px-1">
            Data de Entrada
          </label>
          <div className="relative">
            <Calendar
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-11 pl-9 pr-4 bg-muted border border-border rounded-2xl focus:bg-background focus:border-foreground/30 outline-none transition-all font-semibold text-sm"
            />
          </div>
        </div>
      </div>

      {/* Supplier info strip */}
      {selectedSupplier && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-foreground rounded-[20px] p-4 text-background animate-in slide-in-from-top-1 duration-200">
          {[
            {
              icon: <Briefcase size={14} />,
              label: "CNPJ",
              value: formatDocument(selectedSupplier.identification || ""),
            },
            {
              icon: <Phone size={14} />,
              label: "Telefone",
              value: selectedSupplier.phone,
            },
            {
              icon: <Mail size={14} />,
              label: "E-mail",
              value: selectedSupplier.email,
            },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-background/20 flex items-center justify-center shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-[9px] font-black uppercase opacity-50 leading-none mb-0.5">
                  {label}
                </p>
                <p className="text-xs font-bold leading-tight truncate">
                  {value || "Não informado"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

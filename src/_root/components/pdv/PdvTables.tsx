import { AlertCircle, Clock, User } from "lucide-react";
import type { PdvEntity } from "../../pages/RootPdvPage";
import { formatDate } from "date-fns";

export interface PdvTablesProps {
  entities: PdvEntity[];
  activeEntityId?: string;
  onEntityClick: (entity: PdvEntity) => void;
  getStatusClasses: (status: string) => string;
}

export function PdvTables({
  entities,
  activeEntityId,
  onEntityClick,
  getStatusClasses,
}: PdvTablesProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
      {entities.map((table) => (
        <button
          key={table.id}
          onClick={() => onEntityClick(table)}
          className={`relative flex flex-col p-5 rounded-[24px] text-left transition-transform active:scale-95 border-2 h-36 justify-between ${getStatusClasses(
            table.status,
          )} ${activeEntityId === table.id ? "ring-4 ring-black/10" : ""}`}
        >
          <div className="flex justify-between items-start w-full">
            <span className="font-extrabold text-xl">{table.label}</span>
            {table.status !== "open" && (
              <User size={18} className="opacity-60" />
            )}
          </div>

          <div className="flex flex-col gap-1 items-start">
            {table.status === "awaiting" && (
              <div className="flex gap-1">
                <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter bg-amber-200/50 text-amber-800 px-2 py-1 rounded-lg">
                  <AlertCircle size={10} /> Ag. Prato
                </span>
                <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter bg-white/60 text-amber-900 px-2 py-1 rounded-lg border border-amber-200">
                  <Clock size={10} />{" "}
                  {formatDate(table.openedAt || "", "HH:mm")}
                </span>
              </div>
            )}
            {table.total && table.total > 0 ? (
              <span className="font-bold text-lg">
                R$ {table.total.toFixed(2)}
              </span>
            ) : (
              <span className="text-sm font-bold opacity-40 italic">Livre</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

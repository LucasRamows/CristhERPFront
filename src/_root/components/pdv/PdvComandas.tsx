import { AlertCircle, Clock, Receipt } from "lucide-react";
import { formatDate } from "date-fns";
import type { PdvEntity } from "../../types/PdvEntity";

export interface PdvComandasProps {
  entities: PdvEntity[];
  activeEntityId?: string;
  onEntityClick: (entity: PdvEntity) => void;
  getStatusClasses: (status: string) => string;
}

export function PdvComandas({
  entities,
  activeEntityId,
  onEntityClick,
  getStatusClasses,
}: PdvComandasProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 animate-fade-in">
      {entities.map((cmd) => (
        <button
          key={cmd.id}
          onClick={() => onEntityClick(cmd)}
          className={`relative flex flex-col items-center justify-center p-4 rounded-[20px] text-center transition-transform active:scale-95 border-2 ${getStatusClasses(
            cmd.status,
          )} ${activeEntityId === cmd.id ? "ring-4 ring-black/10" : ""}`}
        >
          <Receipt size={24} className="opacity-40 mb-1" />
          <span className="font-extrabold text-lg">
            {cmd.label.replace("Cmd ", "")}
          </span>
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter bg-amber-200/50 text-amber-800 px-2 py-1 rounded-lg">
              <AlertCircle size={10} /> Ag. Prato
            </span>
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter bg-white/60 text-amber-900 px-2 py-1 rounded-lg border border-amber-200">
              <Clock size={10} /> {formatDate(cmd.openedAt || "", "HH:mm")}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

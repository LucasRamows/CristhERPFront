// PDV/components/entities/TablesGrid.tsx
import { AlertCircle, Clock, User } from "lucide-react";
import { formatDate } from "date-fns";
import { usePDV } from "../../utils/types";
import { SearchListPicker } from "../../../../components/shared/SearchListPicker";

export function TablesGrid() {
  const { tables, handleEntityClick: openEntity } = usePDV();

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "available":
        return "bg-white border-gray-200 text-gray-700 hover:border-gray-300";
      case "open":
        return "bg-[#E2F898] border-[#E2F898] text-gray-900 shadow-sm";
      case "awaiting":
        return "bg-[#FACC15] border-[#FACC15] text-gray-900 shadow-sm";
      case "closing":
      case "paid":
      case "canceled":
        return "bg-[#44A08D] border-[#44A08D] text-white shadow-sm";
      default:
        return "bg-white border-gray-200";
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 animate-in fade-in duration-300 overflow-hidden">
      <div className="flex shrink-0 flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full min-w-[250px] flex gap-2 items-center">
          <div className="flex-1">
            <SearchListPicker
              items={tables}
              onSelect={openEntity}
              placeholder="Buscar mesas..."
              searchKeys={["label"]}
              renderItem={(item) => (
                <div className="flex items-center gap-2">
                  <span className="font-bold">{item.label || "N/A"}</span>
                </div>
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-6">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => openEntity(table)}
              className={`relative flex flex-col p-5 rounded-[24px] text-left transition-all active:scale-[0.97] border-2 h-42 justify-between 
                ${getStatusClasses(table.status)} 
             `}
            >
              {/* Cabeçalho */}
              <div className="flex justify-between items-start w-full">
                <span className="font-extrabold text-2xl tracking-tighter">
                  {table.label}
                </span>
                {table.status !== "available" && (
                  <User size={18} className="opacity-60 mt-1" />
                )}
              </div>

              <div className="flex flex-col gap-2 items-start">
                {table.status === "awaiting" && (
                  <div className="flex gap-1">
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter bg-amber-200/70 text-amber-800 px-2.5 py-1 rounded-lg">
                      <AlertCircle size={10} /> Ag. Prato
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter bg-white/70 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
                      <Clock size={10} />
                      {table.openedAt
                        ? formatDate(table.openedAt, "HH:mm")
                        : "--:--"}
                    </span>
                  </div>
                )}

                {/* Valor Total ou "Livre" */}
                {table.total && table.total > 0 ? (
                  <span className="font-bold text-xl text-[#44A08D]">
                    R$ {table.total.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-sm font-bold opacity-50 italic">
                    Livre
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

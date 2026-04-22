// PDV/components/entities/ComandasGrid.tsx
import { formatDate } from "date-fns";
import { AlertCircle, Clock, Plus, Receipt } from "lucide-react";
import { SearchListPicker } from "../../../../components/shared/SearchListPicker";
import { Button } from "../../../../components/ui/button";
import { usePDV } from "../../types/pdv.types";

export function ComandasGrid({
  setIsAddComandaOpen,
}: {
  setIsAddComandaOpen: (open: boolean) => void;
}) {
  const { comandas, handleEntityClick } = usePDV();
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
      <div className="w-full min-w-[250px] flex gap-2 items-center">
        <div className="flex-1">
          <SearchListPicker
            items={comandas}
            onSelect={handleEntityClick}
            placeholder="Buscar comanda..."
            searchKeys={["name", "reference", "label"]}
            renderItem={(item) => (
              <div className="flex items-center gap-2">
                <span className="font-bold">{item.label || "N/A"}</span>
              </div>
            )}
          />
        </div>
        <Button onClick={() => setIsAddComandaOpen(true)}>
          <Plus size={22} /> Adicionar
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <div className="min-h-full grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 animate-fade-in pb-6">
          {comandas.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => handleEntityClick(cmd)}
              className={`relative max-h-32 flex flex-col items-center justify-center p-4 rounded-xl text-center transition-all active:scale-95 border-2 
                ${getStatusClasses(cmd.status)} 
              `}
            >
              {/* Ícone */}
              <Receipt size={24} className="opacity-40 mb-2" />

              {/* Número da Comanda */}
              <span className="font-extrabold text-lg tracking-tight">
                {cmd.label.replace("CMD ", "")}
              </span>

              {/* Informações inferiores */}
              <div className="flex flex-col gap-1 mt-3 w-full">
                {/* Aguardando Prato */}
                {cmd.status === "awaiting" && (
                  <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter bg-amber-200/50 text-amber-800 px-2 py-1 rounded-lg">
                    <AlertCircle size={10} /> Ag. Prato
                  </span>
                )}

                {/* Horário de Abertura */}
                <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter bg-white/60 text-amber-900 px-2 py-1 rounded-lg border border-amber-200">
                  <Clock size={10} />
                  {cmd.openedAt ? formatDate(cmd.openedAt, "HH:mm") : "--:--"}
                </span>
              </div>
            </button>
          ))}
          {comandas.length === 0 && (
            <div className="flex items-center justify-center h-full col-span-full py-20">
              <span className="text-gray-500">Nenhuma comanda criada</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

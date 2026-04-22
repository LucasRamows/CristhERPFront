import { Plus, X } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "../../../../components/ui/sheet";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { usePDV } from "../../types/pdv.types";

export interface AddComandaSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddComandaSheet({
  isOpen,
  onOpenChange,
}: AddComandaSheetProps) {
  const { handleCreateComanda } = usePDV();
  const [comandaNumber, setComandaNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comandaNumber) {
      await handleCreateComanda(comandaNumber);
      setComandaNumber("");
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setComandaNumber("");
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-[400px] p-0 flex flex-col h-full bg-white border-l border-gray-200 [&>button]:hidden outline-none"
      >
        <SheetTitle className="sr-only">Abrir Nova Comanda</SheetTitle>

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">
              PDV • Operação
            </p>
            <h2 className="text-2xl font-black">Nova Comanda</h2>
          </div>
          <Button onClick={() => handleClose()} variant="ghost">
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-tight">
                Número da Comanda / Cartão
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors">
                  <Plus size={20} />
                </div>
                <Input
                  type="number"
                  placeholder="Ex: 105"
                  autoFocus
                  className="h-16 pl-12 pr-4 bg-gray-50 border-zinc-200 rounded-2xl text-xl font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                  value={comandaNumber}
                  onChange={(e) => setComandaNumber(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Digite o número impresso no cartão ou comanda física para
                iniciar um novo atendimento ou leia no leitor de código de
                barras.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] shrink-0">
          <Button
            onClick={handleSubmit}
            disabled={!comandaNumber.trim()}
            className="w-full h-16 bg-[#E2F898] hover:bg-[#d4ed7e] text-gray-900 font-black text-xl rounded-2xl shadow-lg shadow-[#E2F898]/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            Abrir Comanda
          </Button>
          <button
            onClick={() => onOpenChange(false)}
            className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors mt-2"
          >
            Cancelar
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

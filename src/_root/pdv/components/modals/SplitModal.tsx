// TODO: Migrar para PDV Context para controlar divisão de conta sem props externas.
import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../../components/ui/dialog";

export interface SplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onProceed: (splitCount: number) => void;
}

export function SplitModal({
  isOpen,
  onClose,
  total,
  onProceed,
}: SplitModalProps) {
  const [splitCount, setSplitCount] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setSplitCount(1);
    }
  }, [isOpen]);

  const handleDecrease = () => setSplitCount((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => setSplitCount((prev) => prev + 1);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="p-8 border-none rounded-[32px] w-full max-w-sm shadow-2xl bg-white focus:outline-none focus:ring-0 flex flex-col text-center"
      >
        <DialogTitle className="sr-only">Dividir Conta</DialogTitle>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <h2 className="text-2xl font-black mb-2 mt-2 text-zinc-800">
          Dividir Conta
        </h2>
        <p className="text-gray-500 font-medium mb-8">
          Total: R$ {total.toFixed(2)}
        </p>

        {/* Controles de Divisão */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button
            onClick={handleDecrease}
            disabled={splitCount <= 1}
            className={`w-16 h-16 rounded-[20px] flex items-center justify-center transition-all active:scale-95 ${
              splitCount > 1
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-50 text-gray-300 cursor-not-allowed"
            }`}
          >
            <Minus size={28} strokeWidth={3} />
          </button>

          <div className="text-4xl font-black text-zinc-800 w-16 select-none">
            {splitCount}
          </div>

          <button
            onClick={handleIncrease}
            className="w-16 h-16 rounded-[20px] bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-all active:scale-95"
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>

        {/* Resumo do Valor Dividido */}
        {splitCount > 1 && (
          <div className="bg-[#E2F898]/30 p-4 rounded-[20px] mb-8 animate-in zoom-in-95 duration-200 border border-[#E2F898]/50">
            <p className="text-gray-600 font-bold text-sm mb-1 uppercase tracking-wider">
              Valor por pessoa
            </p>
            <p className="text-3xl font-black text-zinc-900">
              R$ {(total / splitCount).toFixed(2)}
            </p>
          </div>
        )}

        {/* Botão de Ação */}
        <button
          onClick={() => onProceed(splitCount)}
          className="w-full py-5 rounded-[20px] font-black text-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg shadow-zinc-900/20"
        >
          Ir para Pagamento
        </button>
      </DialogContent>
    </Dialog>
  );
}

import { Scale, X } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../components/ui/dialog";
import type { SelectedProductForObs } from "../../../services/products/products.service";

export interface PdvWeightModalProps {
  product: SelectedProductForObs | null;
  onClose: () => void;
  onConfirm: (product: SelectedProductForObs) => void;
}

export function PdvWeightModal({
  product,
  onClose,
  onConfirm,
}: PdvWeightModalProps) {
  const [weightInput, setWeightInput] = useState("");

  const weightKg = parseFloat(weightInput.replace(",", ".")) || 0;
  const totalPrice = weightKg * Number(product?.price || 0);
  const isValid = weightKg > 0;

  const handleClose = () => {
    setWeightInput("");
    onClose();
  };

  const handleConfirm = () => {
    if (!product || !isValid) return;
    onConfirm({
      ...product,
      price: totalPrice,
      quantity: 1,
      obs: [`${weightKg.toFixed(3)} kg`],
    });
    setWeightInput("");
  };

  // Teclado numérico
  const handleKey = (key: string) => {
    setWeightInput((prev) => {
      if (key === "⌫") return prev.slice(0, -1);
      if (key === "," && prev.includes(",")) return prev;
      return prev + key;
    });
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "⌫"];

  return (
    <Dialog
      open={!!product}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="p-0 border-none rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl flex flex-col gap-0 bg-white"
      >
        <DialogTitle className="sr-only">Informar Peso</DialogTitle>
        {product && (
          <>
            {/* Header */}
            <div className="p-6 md:p-8 bg-gray-50 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Scale size={16} className="text-[#44A08D]" />
                  <span className="text-xs font-black text-[#44A08D] uppercase tracking-widest">
                    Produto por Peso
                  </span>
                </div>
                <h2 className="text-2xl font-black">{product.name}</h2>
                <p className="text-sm text-gray-500 font-bold mt-1">
                  R$ {Number(product.price).toFixed(2)} / kg
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Display do peso e valor */}
            <div className="px-6 pt-6 pb-2 flex flex-col items-center gap-1">
              <div className="w-full bg-gray-50 rounded-[20px] p-5 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Peso Informado
                </p>
                <p className="text-5xl font-black text-gray-900 tracking-tight">
                  {weightInput || "0"}{" "}
                  <span className="text-2xl text-gray-400">kg</span>
                </p>
              </div>

              {isValid && (
                <div className="w-full mt-3 bg-[#E2F898]/40 rounded-[16px] p-4 text-center">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Valor Total
                  </p>
                  <p className="text-2xl font-black text-[#44A08D]">
                    R$ {totalPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    {weightKg.toFixed(3)} kg × R${" "}
                    {Number(product.price).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Teclado numérico */}
            <div className="px-6 pb-2 pt-4 grid grid-cols-3 gap-2">
              {keys.map((key) => (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className={`h-14 rounded-[16px] font-black text-xl transition-all active:scale-95 ${
                    key === "⌫"
                      ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Botão confirmar */}
            <div className="p-6 pt-3">
              <button
                disabled={!isValid}
                onClick={handleConfirm}
                className="w-full bg-[#E2F898] text-gray-900 font-black text-xl py-4 rounded-2xl hover:brightness-95 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirmar — R$ {totalPrice.toFixed(2)}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

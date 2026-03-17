import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../components/ui/dialog";
import type { SelectedProductForObs } from "../../../services/products/products.service";

export interface PdvProductModalProps {
  product: SelectedProductForObs | null;
  onClose: () => void;
  onConfirm: (product: SelectedProductForObs) => void;
}

export function PdvProductModal({
  product,
  onClose,
  onConfirm,
}: PdvProductModalProps) {
  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="p-0 border-none rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl flex flex-col gap-0 bg-white"
      >
        <DialogTitle className="sr-only">Confirmar Item</DialogTitle>
        {product && (
          <>
            <div className="p-6 md:p-8 bg-gray-50 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black">{product.name}</h2>
                <p className="text-lg text-[#44A08D] font-bold">
                  R$ {Number(product.price).toFixed(2)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 border-t border-gray-100 bg-white flex flex-col gap-4">
              <p className="font-bold text-gray-500 text-center">
                Deseja adicionar este item ao carrinho?
              </p>
              <button
                onClick={() => onConfirm(product)}
                className="w-full bg-[#E2F898] text-gray-900 font-black text-xl py-4 rounded-2xl hover:brightness-95 active:scale-[0.98] transition-all"
              >
                Confirmar
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

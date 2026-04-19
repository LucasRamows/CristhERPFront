import { Tooltip } from "@radix-ui/react-tooltip";
import { Clock, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../../components/ui/dialog";
import {
  TooltipContent,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import { usePDV } from "../../utils/types";
import { PdvRenderDatePicker } from "./DatesModel";

export function ProductModal() {
  const {
    selectedProduct: product,
    confirmAddToCart,
    activeEntity,
    setSelectedProduct,
    isSyncing
  } = usePDV();


  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saleDate, setSaleDate] = useState<Date | undefined>();

  const onConfirm = async (item: any, options?: any) => {
    await confirmAddToCart(item, options);
    setSelectedProduct(null);
  };

  return (
    <Dialog
      open={!!product}
      onOpenChange={(open) => !open && setSelectedProduct(null)}
    >
      <DialogContent
        showCloseButton={false}
        className="p-0 border-none rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl flex flex-col gap-0 bg-white"
      >
        <DialogTitle className="sr-only">Confirmar Item</DialogTitle>
        {product && (
          <>
            <div className="relative p-6 md:p-8 bg-linear-to-br from-gray-50 to-gray-100 flex justify-between items-start rounded-t-3xl">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                  {product.name}
                </h2>
                <p className="text-xl text-[#44A08D] font-extrabold mt-1">
                  R$ {Number(product.price).toFixed(2)}
                </p>
              </div>

              {/* Close */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2.5 bg-white/80 backdrop-blur rounded-full shadow-md hover:bg-white transition-all"
              >
                <X size={22} className="text-gray-700" />
              </button>
            </div>

            <div className="p-6 bg-white flex flex-col gap-4 border-t border-gray-100">
              {activeEntity?.id === "caixa_balcao" && !showDatePicker && (
                <div className="flex items-end justify-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowDatePicker(true)}
                      >
                        <Clock size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Adicionar data retroativa</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
              {!showDatePicker && (
                <p className="font-semibold text-gray-500 text-center text-sm md:text-base">
                  Deseja adicionar este item ao carrinho?
                </p>
              )}

              {showDatePicker ? (
                <PdvRenderDatePicker
                  product={product}
                  saleDate={saleDate}
                  setSaleDate={(date) => setSaleDate(date)}
                  setShowDatePicker={setShowDatePicker}
                  isSyncing={isSyncing}
                  onConfirm={(p) => onConfirm(p, { saleDate })}
                />
              ) : (
                <Button disabled={isSyncing} onClick={() => onConfirm(product)}>
                  {isSyncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Confirmar"
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

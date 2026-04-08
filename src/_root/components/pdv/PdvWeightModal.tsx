import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Scale, X, Clock } from "lucide-react";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../components/ui/dialog";
import type { SelectedProductForObs } from "../../../services/products/products.service";
import { Button } from "../../../components/ui/button";
import { Calendar } from "../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { BrInput } from "../../../components/ui/BrInput";

export interface PdvWeightModalProps {
  product: SelectedProductForObs | null;
  onClose: () => void;
  onConfirm: (product: SelectedProductForObs, options?: any) => void;
  activeEntity?: any;
}

export function PdvWeightModal({
  product,
  onClose,
  onConfirm,
  activeEntity,
}: PdvWeightModalProps) {
  const [weight, setWeight] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saleDate, setSaleDate] = useState<Date | undefined>();

  const isBalcao =
    activeEntity?.id === "caixa_balcao" ||
    activeEntity?.orderType === "COUNTER";

  const isRetroactive = Boolean(
    activeEntity?.sale_date &&
      new Date(activeEntity.sale_date).setHours(0, 0, 0, 0) <
        new Date().setHours(0, 0, 0, 0),
  );

  const totalPrice = weight * Number(product?.price || 0);
  const isValid = weight > 0;

  const handleClose = () => {
    setWeight(0);
    setShowDatePicker(false);
    setSaleDate(undefined);
    onClose();
  };

  const handleConfirm = (overrideDate?: Date) => {
    if (!product || !isValid) return;
    onConfirm(
      {
        ...product,
        price: totalPrice,
        quantity: 1,
        obs: [`${weight.toFixed(3)} kg`],
      },
      {
        saleDate: overrideDate ? overrideDate : new Date(),
      },
    );
    setWeight(0);
    setShowDatePicker(false);
    setSaleDate(undefined);
  };

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
            <div className="px-6 pt-6 pb-2 flex flex-col items-center gap-3">
              <div className="w-full">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">
                  Peso Informado (kg)
                </p>
                <BrInput
                  value={weight}
                  onChange={setWeight}
                  decimals={3}
                  className="w-full h-24 bg-gray-50 rounded-[20px] border-none flex justify-center items-center text-center px-4"
                  inputClassName="text-5xl font-black text-gray-900 bg-transparent text-center outline-none w-full"
                />
              </div>

              {isValid && (
                <div className="w-full bg-[#E2F898]/40 rounded-[16px] p-4 text-center mt-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Valor Total
                  </p>
                  <p className="text-2xl font-black text-[#44A08D]">
                    R$ {totalPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    {weight.toFixed(3)} kg × R${" "}
                    {Number(product.price).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Botão confirmar e Retroativa */}
            <div className="p-6 pt-3 flex flex-col gap-3 border-t border-gray-100">
              {isBalcao && !showDatePicker && !isRetroactive && (
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

              {showDatePicker ? (
                <div className="flex flex-col gap-4 animate-fade-in bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm">
                  <span className="text-sm font-bold text-gray-700 text-center">
                    Selecione a Data da Venda
                  </span>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal py-6 rounded-xl ${
                          !saleDate ? "text-muted-foreground" : ""
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {saleDate ? (
                          format(saleDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecionar data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-60" align="start">
                      <Calendar
                        mode="single"
                        selected={saleDate}
                        onSelect={setSaleDate}
                        disabled={{ after: new Date() }}
                        locale={ptBR}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      disabled={!saleDate || !isValid}
                      onClick={() => handleConfirm(saleDate)}
                      className="flex-1 bg-[#44A08D] text-white font-bold py-3 rounded-xl hover:bg-[#44A08D]/90 transition-colors disabled:opacity-50"
                    >
                      Lançar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  disabled={!isValid}
                  onClick={() => handleConfirm()}
                  className="w-full bg-[#E2F898] text-gray-900 font-black text-xl py-4 rounded-2xl hover:brightness-95 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirmar — R$ {totalPrice.toFixed(2)}
                </button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

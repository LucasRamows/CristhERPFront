import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Calendar } from "../../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import type { SelectedProductForObs } from "../../../../services/products/products.service";

export interface PdvRenderActionsProps {
  onConfirm: (product: SelectedProductForObs) => void;
  product: SelectedProductForObs;
  isBalcao: boolean;
  setShowDatePicker: (show: boolean) => void;
}

export const PdvRenderActions = ({
  onConfirm,
  product,
  isBalcao,
  setShowDatePicker,
}: PdvRenderActionsProps) => (
  <>
    <button
      onClick={() => onConfirm(product)}
      className="w-full bg-[#E2F898] text-gray-900 font-extrabold text-lg py-4 rounded-2xl shadow-md hover:brightness-95 active:scale-[0.97] transition-all"
    >
      Confirmar
    </button>

    {isBalcao && (
      <>
        <div className="flex items-center gap-2 my-1">
          <div className="flex-1 h-[1px] bg-gray-200" />
          <span className="text-xs text-gray-400 font-semibold">ou</span>
          <div className="flex-1 h-[1px] bg-gray-200" />
        </div>

        <Button
          onClick={() => setShowDatePicker(true)}
          className="w-full bg-gray-100 text-gray-700 font-bold text-lg py-4 rounded-2xl border border-gray-200 hover:bg-gray-200 active:scale-[0.97] transition-all"
        >
          Lançar Venda Retroativa
        </Button>
      </>
    )}
  </>
);

export interface PdvRenderDatePickerProps {
  saleDate: Date | undefined;
  setSaleDate: (date: Date | undefined) => void;
  setShowDatePicker: (show: boolean) => void;
  onConfirm: (product: SelectedProductForObs, options?: any) => void;
  product: SelectedProductForObs;
}

export const PdvRenderDatePicker = ({
  saleDate,
  setSaleDate,
  setShowDatePicker,
  onConfirm,
  product,
}: PdvRenderDatePickerProps) => (
  <div className="flex flex-col gap-4 animate-fade-in bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
    <span className="text-sm font-bold text-gray-700 text-center">
      Selecione a Data da Venda
    </span>

    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
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
        disabled={!saleDate}
        onClick={() => onConfirm(product, { saleDate })}
        className="flex-1 bg-[#44A08D] text-white font-bold py-3 rounded-xl hover:bg-[#44A08D]/90 transition-colors disabled:opacity-50"
      >
        Lançar
      </button>
    </div>
  </div>
);
import { CheckCircle, Hammer, Loader2 } from "lucide-react";
import { PaymentMethod, PaymentMethodLabel } from "../../../../types/enums";

interface PaymentMethodsViewProps {
  activeMethod: PaymentMethod | string | null;
  isSubmitting: boolean;
  hideFiado?: boolean;
  mode: "pdv" | "payment_only";
  onSelectMethod: (method: PaymentMethod | string) => void;
  onEnterFiadoMode: () => void;
  onConfirm: () => void;
}

const PAYMENT_METHODS = [
  PaymentMethod.PIX,
  PaymentMethod.CREDIT_CARD,
  PaymentMethod.DEBIT_CARD,
  PaymentMethod.CASH,
];

export function PaymentMethodsView({
  activeMethod,
  isSubmitting,
  hideFiado,
  mode,
  onSelectMethod,
  onEnterFiadoMode,
  onConfirm,
}: PaymentMethodsViewProps) {
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-300">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-zinc-800">Forma de Pagamento</h3>
        {!hideFiado && (
          <button
            type="button"
            title="Pendurar conta (Fiado)"
            onClick={onEnterFiadoMode}
            className="p-2 text-gray-400 hover:text-[#44A08D] hover:bg-[#44A08D]/10 rounded-full transition-all active:scale-95"
          >
            <Hammer size={20} />
          </button>
        )}
      </div>

      {/* Grade de Métodos */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {PAYMENT_METHODS.map((method) => {
          const isActive = activeMethod === method;
          return (
            <button
              key={method}
              type="button"
              onClick={() => onSelectMethod(method)}
              className={`py-3.5 border-2 rounded-[16px] font-bold text-base transition-all active:scale-[0.98] ${
                isActive
                  ? "border-[#E2F898] bg-[#E2F898] text-gray-900 shadow-md shadow-[#E2F898]/10"
                  : "border-gray-100 bg-white hover:border-gray-200 text-gray-600"
              }`}
            >
              {PaymentMethodLabel[method as PaymentMethod] || method}
            </button>
          );
        })}
      </div>

      {/* Botão de Ação Inferior */}
      <div className="mt-auto">
        <button
          type="button"
          onClick={onConfirm}
          disabled={!activeMethod || isSubmitting}
          className={`w-full py-4 rounded-[16px] font-black text-lg flex justify-center items-center gap-2 transition-all active:scale-[0.98] ${
            activeMethod && !isSubmitting
              ? "bg-[#E2F898] text-gray-900 hover:brightness-95 shadow-lg shadow-[#E2F898]/20"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              <span>Processando...</span>
            </>
          ) : (
            <>
              <CheckCircle size={22} />
              <span>
                {mode === "pdv" ? "Finalizar Venda" : "Confirmar Recebimento"}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

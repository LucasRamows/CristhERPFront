// TODO: Migrar o modal de pagamento para o contexto PDV quando o fluxo de pagamento estiver estabilizado.
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { formatMoney, removeMask } from "../../../../lib/utils";
import { costomersService } from "../../../../services/costomers/customers.service";
import { PaymentMethod } from "../../../../types/enums";
import { PaymentMethodsView } from "./PaymentMethodsView";
import { StoreCreditView } from "./StoreCreditView";

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  serviceTax: number;
  total: number;
  mode?: "pdv" | "payment_only";
  hideFiado?: boolean;
  onConfirm?: (data: {
    method: PaymentMethod | string;
    amount: number;
    subtotal: number;
    serviceTax: number;
    discount: number;
    customerId?: string;
  }) => void | Promise<void>;
  title?: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  subtotal,
  serviceTax,
  total,
  mode = "pdv",
  hideFiado = false,
  onConfirm,
  title = "Pagamento Rápido",
}: PaymentModalProps) {
  // --- ESTADOS ---
  const [discount, setDiscount] = useState<number>(0);
  const [activeMethod, setActiveMethod] = useState<
    PaymentMethod | string | null
  >(null);
  const [isFiadoMode, setIsFiadoMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [receivedAmount, setReceivedAmount] = useState<number>(total);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- CÁLCULOS ---
  const finalTotal = useMemo(() => total - Number(discount), [total, discount]);

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedId),
    [clients, selectedId],
  );

  // --- BUSCA DE CLIENTES ---
  useEffect(() => {
    if (isOpen) {
      const fetchClients = async () => {
        try {
          setIsLoadingClients(true);
          const response = await costomersService.getUnblockedCustomers();
          setClients(response);
        } catch (error) {
          console.error("Erro ao buscar clientes:", error);
        } finally {
          setIsLoadingClients(false);
        }
      };
      fetchClients();
    }
  }, [isOpen]);

  // --- LÓGICA DE CONFIRMAÇÃO ---
  const handleExecuteConfirm = async (
    methodOverride?: PaymentMethod | string,
  ) => {
    const method = methodOverride || activeMethod;
    if (!method || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onConfirm?.({
        method: method,
        subtotal: subtotal,
        serviceTax: serviceTax,
        amount: mode === "pdv" ? finalTotal : receivedAmount,
        discount: discount,
        customerId: selectedId ? String(selectedId) : undefined,
      });

      // Resetar estados e fechar
      setDiscount(0);
      setActiveMethod(null);
      setSelectedId(null);
      setIsFiadoMode(false);
      onClose();
    } catch (error) {
      console.error("Falha no processo de pagamento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="p-0 border-none rounded-[32px] w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl bg-white focus:outline-none focus:ring-0 [&>button]:hidden"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Resumo Superior (Scrollable) */}
        <div className="flex-1 bg-gray-50 flex flex-col overflow-y-auto hide-scrollbar">
          <div className="p-6 flex flex-col border-b border-gray-200">
            <h2 className="text-xl font-black mb-6">{title}</h2>

            <div className="space-y-4">
              {mode === "pdv" ? (
                <>
                  <div className="flex justify-between text-base font-bold text-gray-500">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  {serviceTax > 0 && (
                    <div className="flex justify-between text-base font-bold text-gray-500">
                      <span>Serviço</span>
                      <span>R$ {serviceTax.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <label className="text-sm font-bold text-gray-500 mb-2 block">
                      Desconto (R$)
                    </label>
                    <input
                      type="text"
                      value={formatMoney(discount)}
                      onChange={(e) =>
                        setDiscount(Number(removeMask(e.target.value)) / 100)
                      }
                      className="w-full bg-white border border-gray-200 rounded-[12px] py-2.5 px-4 font-bold text-base focus:outline-none focus:border-[#44A08D] focus:ring-1 focus:ring-[#44A08D] transition-colors"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider block">
                    Valor a Receber
                  </label>
                  <input
                    type="text"
                    value={formatMoney(receivedAmount)}
                    onChange={(e) =>
                      setReceivedAmount(
                        Number(removeMask(e.target.value)) / 100,
                      )
                    }
                    className="w-full bg-white border-2 border-zinc-200 rounded-[20px] py-5 px-6 font-black text-3xl text-zinc-900 focus:outline-none focus:border-[#44A08D] transition-all"
                  />
                  <div className="bg-zinc-100 p-4 rounded-2xl border border-zinc-200/50 flex justify-between items-center">
                    <span className="text-sm font-bold text-zinc-500 uppercase">
                      Dívida Total
                    </span>
                    <span className="text-lg font-black text-red-500">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {mode === "pdv" && (
              <div className="mt-6 bg-white p-4 rounded-[16px] shadow-sm flex justify-between items-center border border-gray-100">
                <span className="text-lg font-bold text-gray-500">Total</span>
                <span className="text-2xl font-black text-[#44A08D]">
                  R$ {Math.max(0, finalTotal).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Ações Inferiores (Fixed) */}
        <div className="p-6 bg-white shrink-0">
          {isFiadoMode ? (
            <StoreCreditView
              clients={clients}
              selectedClient={selectedClient}
              isLoading={isLoadingClients}
              isSubmitting={isSubmitting}
              onSelect={(id) => setSelectedId(id)}
              onRemoveSelection={() => setSelectedId(null)}
              onBack={() => {
                setIsFiadoMode(false);
                setSelectedId(null);
              }}
              onConfirm={() => handleExecuteConfirm(PaymentMethod.STORE_CREDIT)}
            />
          ) : (
            <PaymentMethodsView
              activeMethod={activeMethod}
              isSubmitting={isSubmitting}
              hideFiado={hideFiado}
              mode={mode}
              onSelectMethod={setActiveMethod}
              onEnterFiadoMode={() => setIsFiadoMode(true)}
              onConfirm={() => handleExecuteConfirm()}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

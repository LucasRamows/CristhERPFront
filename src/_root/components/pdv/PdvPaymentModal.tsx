import {
  Ban,
  CheckCircle,
  ChevronLeft,
  Hammer,
  Trash,
  User,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { SearhListPicker } from "../../../components/shared/SearhListPicker";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../components/ui/dialog";
import { formatMoney, removeMask } from "../../../lib/utils";
import { costomersService } from "../../../services/costomers/customers.service";

export interface PdvPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal?: number;
  serviceTax?: number;
  total: number;
  mode?: "pdv" | "payment_only";
  hideFiado?: boolean;
  onConfirm?: (data: {
    method: string;
    amount: number;
    discount: number;
    customerId?: string;
  }) => void | Promise<void>;
  title?: string;
}
export function PdvPaymentModal({
  isOpen,
  onClose,
  subtotal = 0,
  serviceTax = 0,
  total,
  mode = "pdv",
  hideFiado = false,
  onConfirm,
  title = "Pagamento Rápido",
}: PdvPaymentModalProps) {
  const [discount, setDiscount] = useState<number>(0);
  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const [isFiadoMode, setIsFiadoMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [receivedAmount, setReceivedAmount] = useState<number>(total);
  const handleSelect = (client: any) => {
    setSelectedId(client.id);
  };
  const finalTotal = total - Number(discount);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const response = await costomersService.getUnblockedCustomers();
        setClients(response);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

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

        {/* Resumo Superior */}
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
                    <div className="relative">
                      <input
                        type="text"
                        min="0"
                        step="0.01"
                        value={formatMoney(discount)}
                        onChange={(e) =>
                          setDiscount(Number(removeMask(e.target.value)) / 100)
                        }
                        placeholder="0.00"
                        className="w-full bg-white border border-gray-200 rounded-[12px] py-2.5 pl-2 pr-4 font-bold text-base focus:outline-none focus:border-[#44A08D] focus:ring-1 focus:ring-[#44A08D] transition-colors"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-500 mb-2 block uppercase tracking-wider">
                      Valor a Receber
                    </label>
                    <div className="relative">
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
                    </div>
                  </div>
                  <div className="bg-zinc-100 p-4 rounded-2xl border border-zinc-200/50 flex justify-between items-center mt-4">
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

        {/* Ações Inferiores */}
        <div className="w-full bg-white p-6 flex flex-col shrink-0">
          {isFiadoMode ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setIsFiadoMode(false)}
                  className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h3 className="text-lg font-bold">Pendurar Conta</h3>
              </div>

              <div className="mb-6 space-y-3">
                <label className="text-sm font-bold text-gray-500">
                  Vincular ao Cadastro de
                </label>
                {selectedId ? (
                  <div
                    key={selectedId}
                    className="w-full flex items-center justify-between p-4 hover:bg-blue-50/50 border-b border-zinc-50 last:border-none transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                        ${
                          clients.find((c) => c.id === selectedId)?.isBlocked
                            ? "bg-red-50 text-red-500"
                            : "bg-gray-100 text-zinc-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                        }`}
                      >
                        {clients.find((c) => c.id === selectedId)?.isBlocked ? (
                          <Ban size={18} />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
                          {clients.find((c) => c.id === selectedId)?.fullName}
                          {clients.find((c) => c.id === selectedId)
                            ?.isBlocked && (
                            <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded">
                              BLOQ
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-medium">
                          {clients.find((c) => c.id === selectedId)?.nickname} •{" "}
                          {clients.find((c) => c.id === selectedId)?.cpf}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedId(null)}>
                      <Trash
                        size={18}
                        className="text-red-500 hover:text-red-600 cursor-pointer"
                      />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    {isLoading ? (
                      <div className="w-full h-20 flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-6 h-6 border-2 border-[#44A08D]/30 border-t-[#44A08D] rounded-full animate-spin" />
                        <span className="ml-3 text-sm font-bold text-gray-400 uppercase tracking-widest">
                          Carregando Clientes...
                        </span>
                      </div>
                    ) : (
                      <SearhListPicker
                        items={clients}
                        onSelect={handleSelect}
                        placeholder="Pesquisar por nome, apelido ou CPF..."
                        searchKeys={["fullName", "nickname", "cpf"]}
                        renderItem={(client) => (
                          <div className="flex items-center gap-3 py-1">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                              ${
                                client.isBlocked
                                  ? "bg-red-50 text-red-500"
                                  : "bg-gray-100 text-zinc-500 group-hover:bg-[#44A08D]/10 group-hover:text-[#44A08D]"
                              }`}
                            >
                              {client.isBlocked ? (
                                <Ban size={18} />
                              ) : (
                                <User size={18} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-zinc-800 flex items-center gap-2 truncate">
                                {client.fullName}
                                {client.isBlocked && (
                                  <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded tracking-tighter">
                                    BLOQ
                                  </span>
                                )}
                              </h4>
                              <p className="text-[11px] text-zinc-500 font-medium truncate">
                                {client.nickname} • {client.cpf}
                              </p>
                            </div>
                          </div>
                        )}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="mt-auto space-y-3">
                <button
                  onClick={async () => {
                    if (!selectedId || isSubmitting) return;
                    setIsSubmitting(true);
                    try {
                      await onConfirm?.({
                        method: "Fiado",
                        amount: mode === "pdv" ? finalTotal : receivedAmount,
                        discount: discount,
                        customerId: String(selectedId),
                      });
                      onClose();
                    } catch (error) {
                      console.error("Falha ao salvar dívida:", error);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={!selectedId || isSubmitting}
                  className={`w-full py-4 rounded-[16px] font-black text-lg flex justify-center gap-2 transition-all active:scale-[0.98] ${
                    selectedId && !isSubmitting
                      ? "bg-[#E2F898] text-gray-900 hover:brightness-95 shadow-lg shadow-[#E2F898]/20"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <CheckCircle size={22} />{" "}
                  {isSubmitting ? "Salvando..." : "Salvar Dívida"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Forma de Pagamento</h3>
                {!hideFiado && (
                  <button
                    title="Pendurar conta (Fiado)"
                    onClick={() => setIsFiadoMode(true)}
                    className="p-2 text-gray-400 hover:text-[#44A08D] hover:bg-[#44A08D]/10 rounded-full transition-all active:scale-95"
                  >
                    <Hammer size={20} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {["PIX", "Crédito", "Débito", "Dinheiro"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setActiveMethod(method)}
                    className={`py-3.5 border-2 rounded-[16px] font-bold text-base transition-colors ${
                      activeMethod === method
                        ? "border-[#E2F898] bg-[#E2F898] text-gray-900"
                        : "border-gray-100 bg-white hover:border-[#E2F898] hover:bg-[#E2F898]/10 text-gray-600"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <div className="mt-auto space-y-3">
                <button
                  onClick={async () => {
                    if (!activeMethod || isSubmitting) return;
                    setIsSubmitting(true);
                    try {
                      await onConfirm?.({
                        method: activeMethod,
                        amount: mode === "pdv" ? finalTotal : receivedAmount,
                        discount: discount,
                      });
                      onClose();
                    } catch (error) {
                      console.error("Falha ao processar pagamento:", error);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={!activeMethod || isSubmitting}
                  className={`w-full py-4 rounded-[16px] font-black text-lg flex justify-center gap-2 transition-all active:scale-[0.98] ${
                    activeMethod && !isSubmitting
                      ? "bg-[#E2F898] text-gray-900 hover:brightness-95 shadow-lg shadow-[#E2F898]/20"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <CheckCircle size={22} />{" "}
                  {isSubmitting
                    ? "Processando..."
                    : mode === "pdv"
                    ? "Finalizar Venda"
                    : "Confirmar Recebimento"}
                </button>
                {/* {mode === "pdv" && (
                  <button className="w-full py-3.5 rounded-[16px] font-bold text-base bg-gray-900 text-white flex justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all">
                    <Printer size={18} /> Emitir NFC-e
                  </button>
                )} */}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

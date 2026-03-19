import { CheckCircle, Grid, Minus, Plus, Scale, ShoppingCart, X } from "lucide-react";
import LoadingComponent from "../../../components/shared/LoadingComponent";
import { Sheet, SheetContent, SheetTitle } from "../../../components/ui/sheet";
import type { PdvEntity } from "../../pages/RootPdvPage";

export interface CartItem {
  id: string;
  uniqueId: number;
  name: string;
  price: number;
  quantity: number;
  obs?: string[];
  category?: string;
  code?: string;
  isScale?: boolean; // produto de balança
}

export interface PdvTicketSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeEntity: PdvEntity | null;
  addClick: (entity: any) => void;
  cart: CartItem[];
  onCloseEntity: () => void;
  updateQuantity: (index: number, delta: number) => void;
  includeService: boolean;
  setIncludeService: (include: boolean) => void;
  serviceTax: number;
  total: number;
  onSplit: () => void;
  onPayment: () => void;
  isSyncing: boolean;
  setActiveView: (view: string) => void;
}

export function PdvTicketSheet({
  isOpen,
  onOpenChange,
  activeEntity,
  addClick,
  cart,
  onCloseEntity,
  updateQuantity,
  includeService,
  setIncludeService,
  serviceTax,
  total,
  onSplit,
  onPayment,
  isSyncing,
  setActiveView,
}: PdvTicketSheetProps) {
  const handleOpenChange = (open: any) => {
    onOpenChange(open);
    if (!open) {
      console.log("1 aab");
      setActiveView("menu");
    }
  };
  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-[400px] p-0 flex flex-col h-full bg-white border-l border-gray-200 [&>button]:hidden outline-none"
      >
        {activeEntity ? (
          <>
            <SheetTitle className="sr-only">
              Carrinho de {activeEntity.label}
            </SheetTitle>

            {/* Header do Carrinho */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
              <div>
                <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">
                  {activeEntity.orderType === "COUNTER"
                    ? "Venda Direta"
                    : `Pedido Atual`}
                </p>
                <h2 className="text-2xl font-black">{activeEntity.label}</h2>
              </div>
              <button
                onClick={() => {
                  onCloseEntity();
                  handleOpenChange(false);
                }}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-100 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Itens do Carrinho */}
            {isSyncing ? (
              <LoadingComponent />
            ) : (
              <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-white">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                    <ShoppingCart size={48} className="opacity-50" />
                    <p className="font-bold text-gray-400">Carrinho vazio</p>
                    <button
                      onClick={() => addClick(activeEntity)}
                      className="bg-[#E2F898] text-gray-900 font-black text-lg py-2 px-4 rounded-full hover:brightness-95 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      Adicionar Item
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <>
                      {cart.map((item, index) => (
                        <div
                          key={item.uniqueId}
                          className="p-4 bg-gray-50 rounded-[20px] border border-gray-100"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span className="font-bold text-base leading-tight pr-2">
                              {item.name}
                            </span>
                            <span className="font-bold text-[#44A08D]">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>

                          {/* Controles de Quantidade e Observações */}
                          <div className="flex items-center justify-between mt-2">
                            {item.isScale ? (
                              // Item de balança: mostra o peso
                              <div className="flex items-center gap-2 bg-[#E2F898]/40 border border-[#E2F898] rounded-full px-3 py-1.5">
                                <Scale size={13} className="text-gray-600" />
                                <span className="text-xs font-black text-gray-700">
                                  {item.obs?.[0] || "0.000 kg"}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm">
                                <button
                                  onClick={() => updateQuantity(index, -1)}
                                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="w-8 text-center font-bold text-sm">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(index, 1)}
                                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-green-500"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            )}

                            {!item.isScale && item.obs && item.obs.length > 0 && (
                              <div className="text-xs font-bold text-gray-400 line-clamp-1 flex-1 text-right ml-2">
                                + {item.obs.join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addClick(activeEntity)}
                        className="bg-[#E2F898] text-gray-900 font-black text-lg py-2 px-4 rounded-full hover:brightness-95 active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        Adicionar Item
                      </button>
                    </>
                  </div>
                )}
              </div>
            )}

            {/* Rodapé do Carrinho (Totais e Ações) */}
            <div className="p-6 md:p-8 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] shrink-0">
              {activeEntity.orderType !== "COUNTER" && (
                <div
                  className="flex justify-between items-center mb-4 cursor-pointer"
                  onClick={() => setIncludeService(!includeService)}
                >
                  <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        includeService
                          ? "bg-gray-900 text-white"
                          : "border-2 border-gray-300"
                      }`}
                    >
                      {includeService && <CheckCircle size={14} />}
                    </div>
                    Taxa de Serviço (10%)
                  </span>
                  <span className="font-bold text-gray-700">
                    R$ {serviceTax.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-end mb-6 bg-gray-50 p-4 rounded-[20px]">
                <span className="text-gray-500 font-bold">TOTAL</span>
                <span className="text-3xl font-black text-[#44A08D]">
                  R$ {total.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-2">
                {activeEntity.orderType !== "COUNTER" && (
                  <button
                    onClick={onSplit}
                    disabled={cart.length === 0}
                    className="flex-1 bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    Dividir
                  </button>
                )}
                <button
                  onClick={onPayment}
                  disabled={cart.length === 0}
                  className="flex-2 bg-[#E2F898] text-gray-900 font-black text-lg py-4 rounded-2xl hover:brightness-95 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  Cobrar
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
            <SheetTitle className="sr-only">Carrinho Vazio</SheetTitle>
            <Grid size={64} className="opacity-20 mb-4" />
            <h3 className="text-xl font-bold text-gray-500 mb-2">
              Nenhum item ativo
            </h3>
            <p className="font-medium text-sm">
              Selecione uma mesa, comanda ou abra o caixa rápido para iniciar.
            </p>
            <button
              onClick={() => handleOpenChange(false)}
              className="mt-8 lg:hidden font-bold text-gray-500"
            >
              Fechar
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

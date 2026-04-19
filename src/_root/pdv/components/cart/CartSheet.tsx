// PDV/components/cart/CartSheet.tsx
import { CheckCircle, Minus, Plus, Scale, ShoppingCart, X } from "lucide-react";
import { useState } from "react";

import LoadingComponent from "../../../../components/shared/LoadingComponent";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "../../../../components/ui/sheet";
import type { CartItem } from "../../utils/types";
import { usePDV } from "../../utils/types";
import { PaymentModal } from "../modals/PaymentModal";
import { SplitModal } from "../modals/SplitModal";

export function CartSheet() {
  const {
    activeEntity,
    cart,
    subtotal,
    includeService,
    setIncludeService,
    serviceTax,
    total,
    isSyncing,
    updateQuantity,
    setIsCartSheetOpen,
    handleConfirmPayment,
    handleAddClick,
    isCartSheetOpen,
  } = usePDV();

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSplitOpen, setIsSplitOpen] = useState(false);
  const [splitCount, setSplitCount] = useState(1);

  // const isReadOnly = false; // pode ser controlado pelo contexto no futuro

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsCartSheetOpen(false);
    }
  };

  if (!activeEntity) {
    return null;
  }

  return (
    <Sheet open={isCartSheetOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-[400px] p-0 flex flex-col h-full bg-white border-l border-gray-200 [&>button]:hidden outline-none"
      >
        <SheetTitle className="sr-only">
          Carrinho de {activeEntity.label}
        </SheetTitle>

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">
              {activeEntity.orderType === "COUNTER"
                ? "Venda Direta"
                : "Pedido Atual"}
            </p>
            <h2 className="text-2xl font-black">{activeEntity.label}</h2>
          </div>

          <button
            onClick={() => setIsCartSheetOpen(false)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo do Carrinho */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-white">
          {isSyncing ? (
            <LoadingComponent />
          ) : cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3">
              <ShoppingCart size={48} className="opacity-50" />
              <p className="font-bold text-gray-400">Carrinho vazio</p>
              <button
                onClick={() => {
                  if (activeEntity) handleAddClick(activeEntity);
                }}
                className="bg-[#E2F898] text-gray-900 font-black text-lg py-2 px-4 rounded-full hover:brightness-95 active:scale-[0.98] transition-all"
              >
                Adicionar Item
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cart.map((item: CartItem) => (
                <div
                  key={item.id}
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

                  <div className="flex items-center justify-between mt-2">
                    {item.isScale ? (
                      <div className="flex items-center gap-2 bg-[#E2F898]/40 border border-[#E2F898] rounded-full px-3 py-1.5">
                        <Scale size={13} className="text-gray-600" />
                        <span className="text-xs font-black text-gray-700">
                          {item.obs?.[0] || "0.000 kg"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm">
                        <button
                          onClick={() => {
                            updateQuantity(item.id, -1, !!item.isFromBackend);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-8 text-center font-bold text-sm">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, 1, !!item.isFromBackend)
                          }
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
                onClick={() => {
                  if (activeEntity) handleAddClick(activeEntity);
                }}
                className="bg-[#E2F898] text-gray-900 font-black text-lg py-2 px-4 rounded-full hover:brightness-95 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                Adicionar Item
              </button>
            </div>
          )}
        </div>

        {/* Rodapé com Totais e Ações */}
        <div className="p-6 md:p-8 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] shrink-0">
          {activeEntity.orderType !== "COUNTER" && (
            <div
              className={`flex justify-between items-center mb-4 cursor-pointer`}
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
                onClick={() => setIsSplitOpen(true)}
                disabled={cart.length === 0}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                Dividir
              </button>
            )}

            <button
              onClick={() => setIsPaymentOpen(true)}
              disabled={cart.length === 0}
              className="flex-1 bg-[#E2F898] text-gray-900 font-black text-lg py-4 rounded-2xl hover:brightness-95 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              Cobrar
            </button>
          </div>

          <SplitModal
            isOpen={isSplitOpen}
            onClose={() => setIsSplitOpen(false)}
            total={total}
            onProceed={(count) => {
              setSplitCount(count);
              setIsSplitOpen(false);
              setIsPaymentOpen(true);
            }}
          />

          <PaymentModal
            isOpen={isPaymentOpen}
            onClose={() => setIsPaymentOpen(false)}
            subtotal={subtotal / splitCount}
            serviceTax={serviceTax / splitCount}
            total={total / splitCount}
            onConfirm={async (data) => {
              await handleConfirmPayment({
                method: data.method,
                discount: data.discount,
                customerId: data.customerId,
              });
              setIsPaymentOpen(false);
              setIsCartSheetOpen(false);
              setSplitCount(1);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

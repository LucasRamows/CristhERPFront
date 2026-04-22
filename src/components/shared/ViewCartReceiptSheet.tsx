// src/_root/passbook/components/sheets/ViewCartReceiptSheet.tsx
"use client";

import { Download, X } from "lucide-react";
import { useState } from "react";

import type { ViewCartReceiptSheetProps } from "../../_root/passbook/types/context.type";
import { useAuthenticatedUser } from "../../contexts/DataContext";
import { generateReceiptPDF } from "../../services/receipt/receipt.service";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../ui/sheet";
import LoadingComponent from "./LoadingComponent";
export function ViewCartReceiptSheet({
  isOpen,
  onOpenChange,
  activeEntity,
  cart,
  subtotal,
  discount,
  serviceTax,
  total,
  timestamp,
  isSyncing = false,
  description,
}: ViewCartReceiptSheetProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { data } = useAuthenticatedUser();
  if (!activeEntity) return null;

  console.log(data);
  const handleGenerateReceipt = async () => {
    try {
      setIsGeneratingPDF(true);
      await generateReceiptPDF({
        entity: activeEntity,
        items: cart,
        subtotal,
        discount,
        serviceTax,
        total,
        business: data?.business,
        timestamp: timestamp,
      });
    } catch (error) {
      console.error("Erro ao gerar recibo:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-[90%] sm:max-w-[420px] p-0 flex flex-col h-full bg-white border-l border-gray-100 shadow-2xl [&>button]:hidden outline-none z-[120]"
        >
          <SheetTitle className="sr-only">
            Recibo de {activeEntity.label}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Resumo dos itens e valores do recibo de {activeEntity.label}.
          </SheetDescription>

          {/* Header Customizado */}
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-br from-gray-50 to-white shrink-0">
            <div>
              <p className="text-[#44A08D] font-black uppercase tracking-tighter text-xs mb-1">
                Visualização de Recibo
              </p>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                {activeEntity.label}
              </h2>
            </div>

            <Button
              onClick={() => onOpenChange(false)}
              variant="ghost"
              size="icon"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Conteúdo scrollável */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white space-y-6">
            {isSyncing ? (
              <LoadingComponent />
            ) : cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20 px-6 text-center space-y-4">
                <p className="font-black text-xl text-gray-400">
                  Nenhum item na nota
                </p>
                {(description || (activeEntity as any)?.description) && (
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 w-full mt-4">
                    <p className="font-medium text-gray-500 italic">
                      "{description || (activeEntity as any)?.description}"
                    </p>
                  </div>
                )}
                
                  <div className="border-t-2 border-dashed border-gray-200 pt-6 space-y-3">
                    <div className="flex justify-between items-center bg-[#F1FCE1] p-5 rounded-2xl border border-[#E2F898]">
                      <span className="font-black text-gray-900">
                        VALOR TOTAL DA DÍVIDA
                      </span>
                      <span className="font-black text-2xl text-[#44A08D]">
                        R$ {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
            ) : (
              <div className="space-y-4">
                {/* Cabeçalho de Itens */}
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                  Detalhes do Pedido
                </div>

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-900 leading-tight flex-1 pr-4">
                        {item.name}
                      </span>
                      <span className="font-black text-[#44A08D] whitespace-nowrap">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100">
                        {item.quantity} x R$ {item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="border-t-2 border-dashed border-gray-200 pt-6 space-y-3">
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm font-bold text-gray-500">
                      <span>Desconto</span>
                      <span>R$ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  {serviceTax > 0 && (
                    <div className="flex justify-between text-sm font-bold text-gray-500">
                      <span>Taxa de Serviço</span>
                      <span>R$ {serviceTax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center bg-[#F1FCE1] p-5 rounded-2xl border border-[#E2F898]">
                    <span className="font-black text-gray-900">
                      VALOR TOTAL
                    </span>
                    <span className="font-black text-2xl text-[#44A08D]">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer fixo */}
          {cart.length > 0 && (
            <div className="p-8 bg-gray-50 border-t border-gray-100 shrink-0 space-y-3">
              <Button
                onClick={handleGenerateReceipt}
                disabled={isGeneratingPDF || isSyncing}
                className="w-full"
              >
                <Download size={22} />
                <span>{isGeneratingPDF ? "Gerando..." : "Baixar PDF"}</span>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

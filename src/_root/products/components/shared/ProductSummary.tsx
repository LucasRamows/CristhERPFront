"use client";

import { Activity, AlertCircle, DollarSign, Loader2, Package } from "lucide-react";
import { Card } from "../../../../components/ui/card"; // Ajuste o caminho se necessário
import { useInventoryContext } from "../../hooks/InventoryContext";

interface ProductSummaryProps {
  price: number | string;
  status: boolean;
  isUpdatingStatus?: boolean;

  // Props para modo Retail (estoque)
  isRetail?: boolean;
  currentStock?: number;
  minStock?: number;
  isLoadingStock?: boolean;
}

export function ProductSummary({
  price,
  status,
  isUpdatingStatus = false,

  isRetail = false,
  currentStock = 0,
  minStock = 0,
  isLoadingStock = false,
}: ProductSummaryProps) {

  const {handleUpdateProductStatusInList} = useInventoryContext(); 
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Card de Preço Atual */}
      <Card className="p-5 flex flex-col justify-center border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
              Preço Atual
            </p>
            <p className="text-sm font-black text-foreground">
              R$ {Number(price).toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      {/* Card de Status (Tornado clicável via botão pai) */}
      <button
        type="button"
        disabled={isUpdatingStatus}
        onClick={() => handleUpdateProductStatusInList()}
        className="text-left outline-none block transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
      >
        <Card className="p-5 h-full flex flex-col justify-center border-border shadow-sm hover:bg-muted/40 transition-colors">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                status ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              }`}
            >
              <Activity size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                Status (Clique p/ alterar)
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    status
                      ? "bg-[#DCFF79] shadow-[0_0_10px_#DCFF79]"
                      : "bg-muted-foreground/50"
                  }`}
                />
                <p className="text-sm font-black text-foreground">
                  {isUpdatingStatus ? "Atualizando..." : status ? "Ativo" : "Pausado"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </button>

      {/* Cards de Estoque - Só aparecem se for Retail */}
      {isRetail && (
        <>
          {/* Estoque Atual */}
          <Card className="p-5 flex flex-col justify-center border-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Package size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                  Estoque Atual
                </p>
                {isLoadingStock ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Buscando...
                    </span>
                  </div>
                ) : (
                  <p className="text-sm font-black text-foreground">
                    {currentStock}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Estoque Mínimo */}
          <Card className="p-5 flex flex-col justify-center border-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                  Estoque Mínimo
                </p>
                <p className="text-sm font-black text-foreground">
                  {minStock}
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
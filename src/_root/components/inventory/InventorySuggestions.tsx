import { AlertCircle, ArrowRight, Package, ShoppingCart } from "lucide-react";
import { type IngredientResponse } from "../../../services/inventory/inventory.service";

interface InventorySuggestionsProps {
  items: IngredientResponse[];
  onGenerateQuote: () => void;
}

export function InventorySuggestions({ items, onGenerateQuote }: InventorySuggestionsProps) {
  // Calcula a sugestão de compra (Para 7 dias de cobertura)
  const calcularSugestao = (item: IngredientResponse) => {
    const coberturaDesejada = 7; // dias
    const necessidade = (item.currentStock || 0) * coberturaDesejada;
    const sugestao = necessidade - item.currentStock;
    return sugestao > 0 ? Math.ceil(sugestao) : 0;
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in slide-in-from-bottom-5 duration-700 select-none">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter flex items-center gap-4 mb-3 uppercase">
            <div className="w-14 h-14 bg-primary/10 rounded-[28px] flex items-center justify-center text-primary shadow-inner">
              <ShoppingCart size={32} />
            </div>
            Sugestão de Reposição
          </h2>
          <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest opacity-60">
            Análise baseada na média de consumo diário vs Estoque atual em tempo real.
          </p>
        </div>
        <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-3 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2">
          Janela de Cobertura: <span className="text-emerald-500">07 Dias</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-[48px] border border-zinc-100 dark:border-zinc-900 shadow-2xl overflow-hidden p-3">
        <div className="overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/10 rounded-[40px]">
          <div className="grid grid-cols-12 gap-4 p-8 text-zinc-400 font-black text-[10px] uppercase tracking-[0.25em] border-b border-zinc-100 dark:border-zinc-900">
            <div className="col-span-5">Insumo / Matéria-Prima</div>
            <div className="col-span-2 text-center">Nível Atual</div>
            <div className="col-span-2 text-center">Consumo / Dia</div>
            <div className="col-span-3 text-right">Reposição Sugerida</div>
          </div>

          <div className="flex flex-col bg-white dark:bg-zinc-950">
            {items.map((item) => {
              const sugestao = calcularSugestao(item);
              const critico = item.currentStock <= (item.currentStock || 0) * 2;

              return (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 gap-4 p-8 items-center border-b border-zinc-50 dark:border-zinc-900 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all duration-300 group ${
                    critico ? "bg-red-500/2" : ""
                  }`}
                >
                  <div className="col-span-5 flex items-center gap-5">
                    <div
                      className={`w-14 h-14 rounded-[24px] flex items-center justify-center border-2 transition-all group-hover:scale-110 shadow-sm duration-500 ${
                        critico
                          ? "bg-red-500/10 border-red-500/20 text-red-500"
                          : "bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-400"
                      }`}
                    >
                      {critico ? (
                        <AlertCircle size={28} className="animate-pulse" />
                      ) : (
                        <Package size={28} />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-black text-2xl text-zinc-900 dark:text-zinc-100 tracking-tighter leading-none mb-1 truncate uppercase">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest opacity-60">
                        Insumo em {item.unit}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <span
                      className={`font-black text-2xl tracking-tighter ${
                        critico ? "text-red-500" : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {item.currentStock}
                      <span className="text-[10px] ml-1 opacity-40 font-black uppercase">{item.unit}</span>
                    </span>
                  </div>

                  <div className="col-span-2 text-center flex flex-col">
                    <span className="font-black text-zinc-900 dark:text-zinc-300 text-xl tracking-tighter">
                      {/* {item.dailyAvgUsage} */}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{item.unit}/dia</span>
                  </div>

                  <div className="col-span-3 flex justify-end">
                    {sugestao > 0 ? (
                      <div className="group relative">
                        <div className="absolute -inset-2 bg-primary/20 rounded-[24px] blur-lg opacity-0 group-hover:opacity-100 transition duration-700"></div>
                        <div className="relative bg-primary text-zinc-900 px-8 py-4 rounded-[20px] font-black text-2xl tracking-tighter flex items-center gap-3 shadow-xl active:scale-95 transition-all">
                          <span className="text-sm opacity-50 font-bold">+</span> {sugestao}
                          <span className="text-[10px] opacity-60 uppercase tracking-tighter mt-1">{item.unit}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-8 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] border border-emerald-500/20 shadow-sm whitespace-nowrap">
                        Estoque Suprido
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-end pb-20">
        <button
          onClick={onGenerateQuote}
          className="group relative bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-12 py-6 rounded-[32px] font-black text-2xl tracking-tighter flex items-center gap-5 hover:bg-zinc-800 dark:hover:bg-zinc-50 hover:-translate-y-2 transition-all active:scale-95 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden uppercase"
        >
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-primary/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700"></div>
          Gerar Cotação Inteligente 
          <div className="w-10 h-10 rounded-2xl bg-white/10 dark:bg-zinc-900/5 flex items-center justify-center transition-transform group-hover:rotate-45">
            <ArrowRight size={28} />
          </div>
        </button>
      </div>
    </div>
  );
}

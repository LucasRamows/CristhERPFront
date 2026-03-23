import { Calculator, DollarSign, TrendingDown } from "lucide-react";

interface SmartQuoteItem {
  id: number;
  insumo: string;
  qtdSugestao: number;
  fornecedores: { [key: string]: number };
}

interface SmartQuoteProps {
  items: SmartQuoteItem[];
  onGenerateOrders: () => void;
}

export function SmartQuote({ items, onGenerateOrders }: SmartQuoteProps) {
  // Encontra o menor preço na cotação
  const getMelhorPreco = (fornecedores: { [key: string]: number }) => {
    return Math.min(...Object.values(fornecedores));
  };

  const totalGeral = items.reduce((acc, item) => {
    return acc + getMelhorPreco(item.fornecedores) * item.qtdSugestao;
  }, 0);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-3">
            <Calculator className="text-emerald-600" size={28} />
            Cotação Inteligente (Buscador de Preços)
          </h2>
          <p className="text-gray-500 font-medium">
            Preencha os valores informados pelos fornecedores. O sistema destaca a opção com maior economia automaticamente.
          </p>
        </div>
        
        <div className="flex border border-gray-100 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm h-fit">
          <TrendingDown size={18} className="mr-2" /> Economia inteligente ativa
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-200 shadow-sm overflow-hidden p-2">
        <div className="overflow-x-auto custom-scrollbar rounded-[32px] bg-gray-50">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-12 gap-4 p-6 text-gray-400 font-black text-[10px] uppercase tracking-widest border-b border-gray-100">
              <div className="col-span-4">Insumo / Demanda</div>
              <div className="col-span-2 text-center text-emerald-600">Atacadão S/A</div>
              <div className="col-span-2 text-center text-emerald-600">Makro Foods</div>
              <div className="col-span-2 text-center text-emerald-600">Distrib. Local</div>
              <div className="col-span-2 text-right">Melhor Decisão</div>
            </div>

            <div className="flex flex-col bg-white">
              {items.map((item) => {
                const melhorPreco = getMelhorPreco(item.fornecedores);
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 p-7 items-center border-b border-gray-50 last:border-0 hover:bg-emerald-50/10 transition-colors"
                  >
                    <div className="col-span-4 pr-6">
                      <span className="font-extrabold text-xl text-gray-800 leading-tight block mb-1">
                        {item.insumo}
                      </span>
                      <span className="inline-flex bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                        Demanda: {item.qtdSugestao} unidades
                      </span>
                    </div>

                    {/* Colunas de Fornecedores */}
                    {["A", "B", "C"].map((forn) => {
                      const preco = item.fornecedores[forn];
                      const isMelhor = preco === melhorPreco;
                      return (
                        <div key={forn} className="col-span-2 px-1">
                          <div
                            className={`relative w-full group overflow-hidden px-4 py-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
                              isMelhor
                                ? "bg-primary border-primary shadow-lg scale-105"
                                : "bg-white border-gray-100 hover:border-emerald-200"
                            }`}
                          >
                             {isMelhor && (
                              <div className="absolute top-0 right-0 p-1">
                                <TrendingDown size={14} className="text-gray-900 opacity-30" />
                              </div>
                            )}
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isMelhor ? "text-gray-900/50" : "text-gray-300"}`}>R$</span>
                            <span className={`text-2xl font-black ${isMelhor ? "text-gray-900" : "text-gray-700"}`}>
                              {preco.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    <div className="col-span-2 flex justify-end items-center">
                      <div className="text-right">
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Subtotal</span>
                        <span className="text-3xl font-black text-emerald-600 leading-none">
                          <span className="text-sm font-black mr-1 opacity-50">R$</span>
                          {(melhorPreco * item.qtdSugestao).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rodapé Resumo Cotação */}
            <div className="p-10 bg-gray-900 text-white flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                    <DollarSign size={32} className="text-primary" />
                 </div>
                 <div>
                    <h3 className="text-gray-400 font-black uppercase tracking-widest text-xs mb-1">
                      Resumo da Melhor Compra
                    </h3>
                    <p className="text-xl font-bold border-b-2 border-primary/30 pb-1">
                      Comprando pelo menor preço global por item
                    </p>
                 </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center md:text-right">
                    <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest block mb-1">Investimento Total</span>
                    <span className="text-6xl font-black text-primary leading-none">
                      <span className="text-lg font-black mr-2 opacity-30">R$</span>
                      {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <button 
                  onClick={onGenerateOrders}
                  className="bg-white text-gray-900 px-10 py-5 rounded-[24px] font-black text-xl hover:bg-primary transition-all active:scale-95 shadow-2xl hover:scale-105"
                >
                  Gerar Pedidos de Compra
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

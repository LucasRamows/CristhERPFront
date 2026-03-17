import { Calendar } from "lucide-react";

export interface DreItem {
  tipo:
    | "receita"
    | "imposto"
    | "subtotal"
    | "custo"
    | "despesa"
    | "resultado"
    | string;
  label: string;
  valor: number;
}

export interface FinancialDrePanelProps {
  dreData: DreItem[];
  currentMonth: string;
}

export function FinancialDrePanel({
  dreData,
  currentMonth,
}: FinancialDrePanelProps) {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-800">
            DRE Gerencial - Mastigado
          </h2>
          <p className="text-gray-500 font-medium">
            Entenda exatamente para onde seu dinheiro foi neste mês.
          </p>
        </div>
        <div className="bg-white px-6 py-3 rounded-full border border-gray-200 font-bold flex items-center gap-2 shadow-sm text-gray-700">
          <Calendar size={18} /> {currentMonth}
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-200 p-6 md:p-10 relative overflow-hidden">
        {/* Linha guia de fundo visual */}
        <div className="absolute left-10 md:left-13 top-10 bottom-24 w-1 bg-gray-100 z-0"></div>

        <div className="relative z-10 space-y-2">
          {dreData.map((item, index) => {
            const isReceita = item.tipo === "receita";
            const isDespesa =
              item.tipo === "despesa" ||
              item.tipo === "imposto" ||
              item.tipo === "custo";
            const isSubtotal = item.tipo === "subtotal";
            const isResultado = item.tipo === "resultado";

            if (isResultado) return null; // Renderizamos no final separado

            return (
              <div
                key={index}
                className={`flex items-center gap-6 p-4 rounded-2xl transition-colors ${
                  isSubtotal
                    ? "bg-gray-50 mt-4 mb-4 border border-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 border-white z-10 ${
                    isReceita
                      ? "bg-[#E2F898] text-gray-800"
                      : isDespesa
                      ? "bg-[#FFD1CD] text-red-600"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {isReceita ? "+" : isDespesa ? "-" : "="}
                </div>

                <div className="flex-1">
                  <p
                    className={`font-bold ${
                      isSubtotal
                        ? "text-lg text-gray-800 uppercase tracking-wide"
                        : "text-lg text-gray-600"
                    }`}
                  >
                    {item.label}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`font-black text-xl md:text-2xl ${
                      isDespesa ? "text-red-500" : "text-gray-900"
                    }`}
                  >
                    {item.valor < 0 ? "- " : ""}R${" "}
                    {Math.abs(item.valor).toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resultado Final (Lucro/Prejuízo) */}
        <div className="relative z-10 mt-8 pt-8 border-t-2 border-dashed border-gray-200">
          {dreData
            .filter((i) => i.tipo === "resultado")
            .map((item, index) => (
              <div
                key={index}
                className="bg-[#44A08D] text-white p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-center shadow-lg transform hover:scale-[1.01] transition-transform"
              >
                <div>
                  <p className="text-white/80 font-bold uppercase tracking-widest text-sm mb-1">
                    Resultado Final
                  </p>
                  <h2 className="text-3xl md:text-4xl font-black">
                    {item.label}
                  </h2>
                  <p className="text-white/90 font-medium mt-2">
                    Margem de Lucro:{" "}
                    <strong className="text-[#E2F898] text-xl">32.8%</strong>
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-5xl md:text-6xl font-black text-[#E2F898]">
                    R$ {item.valor.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

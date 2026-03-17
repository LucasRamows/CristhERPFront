import { AlertCircle, CheckCircle, CreditCard } from "lucide-react";

export interface ConciliationItem {
  id: number | string;
  data: string;
  adquirente: string;
  tipo: string;
  valor: number;
  taxaAcordada: number;
  taxaCobrada: number;
  status: "ok" | "divergente" | string;
}

export interface FinancialConciliationPanelProps {
  conciliationData: ConciliationItem[];
}

export function FinancialConciliationPanel({
  conciliationData,
}: FinancialConciliationPanelProps) {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-800">
          Conciliação Automática
        </h2>
        <p className="text-gray-500 font-medium">
          O sistema confere se as maquininhas e apps estão cobrando a taxa
          correta acordada.
        </p>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-100 bg-gray-50 text-gray-500 font-bold text-sm uppercase tracking-wider">
          <div className="col-span-3">Data/Hora</div>
          <div className="col-span-2">Origem</div>
          <div className="col-span-2 text-right">Valor Venda</div>
          <div className="col-span-2 text-center">Taxa Acordada</div>
          <div className="col-span-2 text-center">Taxa Cobrada</div>
          <div className="col-span-1 text-center">Status</div>
        </div>

        <div className="flex flex-col">
          {conciliationData.map((item) => {
            const isDivergente = item.status === "divergente";
            return (
              <div
                key={item.id}
                className={`grid grid-cols-12 gap-4 p-6 items-center border-b border-gray-50 last:border-0 transition-colors ${
                  isDivergente
                    ? "bg-[#FFD1CD]/20 hover:bg-[#FFD1CD]/30"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="col-span-3 font-bold text-gray-700">
                  {item.data}
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      item.adquirente === "Stone"
                        ? "bg-green-100 text-green-700"
                        : item.adquirente === "iFood"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    <CreditCard size={14} />
                  </div>
                  <div>
                    <span className="font-extrabold block leading-tight">
                      {item.adquirente}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      {item.tipo}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 text-right font-black text-lg text-gray-900">
                  R$ {item.valor.toFixed(2)}
                </div>

                <div className="col-span-2 text-center font-bold text-gray-500">
                  {item.taxaAcordada}%
                </div>

                <div
                  className={`col-span-2 text-center font-black text-lg ${
                    isDivergente ? "text-red-600" : "text-[#44A08D]"
                  }`}
                >
                  {item.taxaCobrada}%
                </div>

                <div className="col-span-1 flex justify-center">
                  {isDivergente ? (
                    <div
                      className="w-10 h-10 bg-[#FFD1CD] rounded-full flex items-center justify-center text-red-700 tooltip"
                      title="Divergência Encontrada"
                    >
                      <AlertCircle size={20} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-[#E2F898] rounded-full flex items-center justify-center text-gray-800">
                      <CheckCircle size={20} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

  import {
  CheckCircle,
  CreditCard,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export interface Account {
  id: number;
  descricao: string;
  vencimento: string;
  valor: number;
  status: "pendente" | "pago" | "recebido" | string;
}

export interface FinancialAccountsPanelProps {
  contas: {
    pagar: Account[];
    receber: Account[];
  };
  totalPagar: number;
  totalReceber: number;
}

export function FinancialAccountsPanel({
  contas,
  totalPagar,
  totalReceber,
}: FinancialAccountsPanelProps) {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-200 shadow-sm flex items-center justify-between hover:border-[#FFD1CD] transition-colors">
          <div>
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2 flex items-center gap-2">
              <TrendingDown size={18} className="text-red-500" /> Total a Pagar
              (Próx. 7 dias)
            </h3>
            <p className="text-4xl font-black text-gray-900">
              R$ {totalPagar.toFixed(2)}
            </p>
          </div>
          <div className="w-16 h-16 bg-[#FFD1CD]/30 rounded-full flex items-center justify-center">
            <DollarSign size={32} className="text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-200 shadow-sm flex items-center justify-between hover:border-[#44A08D] transition-colors">
          <div>
            <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#44A08D]" /> Previsão de
              Recebimento
            </h3>
            <p className="text-4xl font-black text-gray-900">
              R$ {totalReceber.toFixed(2)}
            </p>
          </div>
          <div className="w-16 h-16 bg-[#44A08D]/10 rounded-full flex items-center justify-center">
            <CreditCard size={32} className="text-[#44A08D]" />
          </div>
        </div>
      </div>

      {/* Listas Divididas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna A PAGAR */}
        <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-800">A Pagar</h2>
            <button className="text-sm font-bold text-gray-500 hover:text-gray-900">
              + Novo Lançamento
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {contas.pagar.map((conta) => (
              <div
                key={conta.id}
                className="p-4 mx-2 my-2 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors flex justify-between items-center group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      conta.status === "pago"
                        ? "bg-gray-100 text-gray-400"
                        : "bg-[#FFD1CD] text-red-700"
                    }`}
                  >
                    {conta.status === "pago" ? (
                      <CheckCircle size={20} />
                    ) : (
                      <TrendingDown size={20} />
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-bold text-lg ${
                        conta.status === "pago"
                          ? "text-gray-400 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {conta.descricao}
                    </p>
                    <p className="text-sm font-semibold text-gray-500">
                      Venc: {conta.vencimento}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-black text-xl ${
                      conta.status === "pago"
                        ? "text-gray-400"
                        : "text-gray-900"
                    }`}
                  >
                    R$ {conta.valor.toFixed(2)}
                  </p>
                  {conta.status === "pendente" && (
                    <button className="text-xs font-bold text-[#44A08D] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide mt-1">
                      Marcar Pago
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna A RECEBER */}
        <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-800">
              A Receber (Previsão)
            </h2>
            <span className="text-sm font-bold text-gray-500">D+1 e D+30</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {contas.receber.map((conta) => (
              <div
                key={conta.id}
                className="p-4 mx-2 my-2 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      conta.status === "recebido"
                        ? "bg-[#E2F898] text-gray-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {conta.status === "recebido" ? (
                      <CheckCircle size={20} />
                    ) : (
                      <CreditCard size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-900">
                      {conta.descricao}
                    </p>
                    <p className="text-sm font-semibold text-gray-500">
                      Previsto: {conta.vencimento}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-xl text-[#44A08D]">
                    R$ {conta.valor.toFixed(2)}
                  </p>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-md mt-1 inline-block ${
                      conta.status === "recebido"
                        ? "bg-[#E2F898] text-gray-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {conta.status === "recebido" ? "RECEBIDO" : "AGUARDANDO"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

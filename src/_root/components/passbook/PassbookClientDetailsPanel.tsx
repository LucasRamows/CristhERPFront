import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Ban,
  CheckCircle,
  DollarSign,
  History,
  Phone,
  ShieldAlert,
  Trash,
} from "lucide-react";
import {
  type CostomersResponse,
  type LedgerEntry,
} from "../../../services/costomers/customers.service";
import { formatPhone, formatTime } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";

export interface PassbookClientDetailsPanelProps {
  activeClient: CostomersResponse | null;
  setActiveClientId: (id: string | null) => void;
  transactions: LedgerEntry[];
  toggleBloqueio: () => void;
  setIsPaymentModalOpen: (open: boolean) => void;
  onEditProfile: () => void;
  handleDeleteTransaction: (transactionId: string, orderId: string) => void;
}

export function PassbookClientDetailsPanel({
  activeClient,
  setActiveClientId,
  transactions,
  toggleBloqueio,
  setIsPaymentModalOpen,
  onEditProfile,
  handleDeleteTransaction,
}: PassbookClientDetailsPanelProps) {
  return (
    <div
      className={`flex-1 flex-col bg-white overflow-hidden relative ${
        !activeClient ? "hidden lg:flex" : "flex"
      }`}
    >
      {!activeClient ? (
        // EMPTY STATE
        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/50">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert size={48} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-black text-gray-700 mb-2">
            Nenhum cliente selecionado
          </h2>
          <p className="font-medium max-w-sm">
            Selecione um cliente na lista ao lado para ver seu limite, histórico
            de compras e receber pagamentos.
          </p>
        </div>
      ) : (
        // PERFIL DO CLIENTE
        <div className="h-full flex flex-col animate-fade-in">
          {/* HEADER DO CLIENTE */}
          <div className="p-6 md:p-8 border-b border-gray-100 flex items-start gap-6 shrink-0 bg-white">
            <button
              onClick={() => setActiveClientId(null)}
              className="lg:hidden w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 shrink-0"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="relative shrink-0 hidden md:block">
              <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400 font-black text-4xl">
                {activeClient.nickname.charAt(0)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-black text-gray-900 truncate">
                  {activeClient.nickname}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 shrink-0 ${
                    activeClient.isBlocked
                      ? "bg-red-100 text-red-500"
                      : "bg-green-100 text-green-500"
                  }`}
                >
                  {activeClient.isBlocked ? (
                    <>
                      <Ban size={14} /> Bloqueado
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} /> Ativo
                    </>
                  )}
                </span>
              </div>
              <p className="text-lg font-bold text-gray-500 mb-3 truncate">
                {activeClient.fullName}
              </p>

              <div className="flex flex-wrap gap-4 text-sm font-semibold text-gray-500">
                <div className="flex items-center gap-1.5">
                  <DollarSign size={16} /> CPF: {activeClient.cpf}
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={16} /> {formatPhone(activeClient.phone)}
                </div>
              </div>
            </div>

            <button
              onClick={onEditProfile}
              className="hidden md:flex bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm transition-colors shrink-0"
            >
              Editar Perfil
            </button>
          </div>

          {/* CONTEÚDO SCROLLÁVEL */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-gray-50/50">
            {/* 2. PAINEL DE CRÉDITO (DARK MODE) */}
            <div className="bg-[#121212] rounded-[32px] p-8 shadow-2xl relative overflow-hidden mb-8">
              {/* Efeito visual de fundo */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E2F898] opacity-[0.03] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Saldo Devedor (Foco Principal) */}
                <div className="border-b md:border-b-0 md:border-r border-gray-800 pb-8 md:pb-0 md:pr-8">
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-sm mb-2">
                    Saldo Devedor Atual
                  </p>
                  <h3
                    className={`text-6xl font-black tracking-tight ${
                      activeClient.saldoDevedor > 0
                        ? "text-[#FF4C4C]"
                        : "text-gray-300"
                    }`}
                  >
                    R$ {activeClient.saldoDevedor.toFixed(2)}
                  </h3>
                  <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-gray-300 font-bold text-sm">
                    <History size={16} /> Vencimento todo dia{" "}
                    {activeClient.settlementDate}
                  </div>
                </div>

                {/* Limites */}
                <div className="flex flex-col justify-center gap-6">
                  <div>
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">
                      Limite de Crédito Aprovado
                    </p>
                    <p className="text-2xl font-black text-white">
                      R$ {activeClient.creditLimit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">
                      Crédito Disponível p/ Compra
                    </p>
                    <p
                      className={`text-3xl font-black ${
                        activeClient.creditLimit - activeClient.saldoDevedor > 0
                          ? "text-[#00E676]"
                          : "text-red-500"
                      }`}
                    >
                      R${" "}
                      {(
                        activeClient.creditLimit - activeClient.saldoDevedor
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. BOTÕES DE AÇÃO RÁPIDA */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={activeClient.saldoDevedor === 0}
                className="bg-[#00E676] text-gray-900 py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowDownRight size={24} /> Receber Valor
              </button>
              {/* 
              <button className="bg-white border-2 border-gray-200 text-gray-800 py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:border-[#44A08D] hover:text-[#44A08D] active:scale-95 transition-all shadow-sm">
                <MessageCircle size={24} /> Cobrar via Zap
              </button> */}

              <button
                onClick={toggleBloqueio}
                className={`border-2 py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm ${
                  activeClient.isBlocked
                    ? "bg-red-50 border-red-200 text-red-600 hover:border-red-500 hover:bg-red-100"
                    : "bg-white border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <Ban size={24} />{" "}
                {activeClient.isBlocked
                  ? "Desbloquear Conta"
                  : "Bloquear Conta"}
              </button>
            </div>

            {/* 4. HISTÓRICO DE MOVIMENTAÇÃO (EXTRATO) */}
            <div>
              <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                <History className="text-gray-400" /> Extrato do Cliente
              </h3>

              <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-4 p-4 md:p-6 border-b border-gray-100 bg-gray-50 text-gray-500 font-bold text-sm uppercase tracking-wider">
                  <div className="col-span-3">Data / Hora</div>
                  <div className="col-span-5">Descrição</div>
                  <div className="col-span-2 text-center">Operador</div>
                  <div className="col-span-2 text-right">Valor</div>
                </div>

                <div className="flex flex-col">
                  {transactions?.length > 0 ? (
                    transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 md:p-6 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                      >
                        <div className="col-span-1 flex items-center justify-between sm:col-span-3 text-sm font-bold text-gray-500">
                          <div className="col-span-1">
                            <Button
                              variant="destructive"
                              size="icon"
                              className=""
                              onClick={() =>
                                handleDeleteTransaction(tx.id, tx.orderId)
                              }
                            >
                              <Trash />
                            </Button>
                          </div>{" "}
                          {formatTime(tx.createdAt)}
                        </div>

                        <div className="col-span-1 sm:col-span-5 flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              tx.type === "DEBT"
                                ? "bg-red-100 text-red-500"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {tx.type === "DEBT" ? (
                              <ArrowUpRight size={16} />
                            ) : (
                              <ArrowDownRight size={16} />
                            )}
                          </div>
                          <span className="font-extrabold text-gray-800">
                            {tx.description}
                          </span>
                        </div>

                        <div className="col-span-1 sm:col-span-2 sm:text-center text-sm font-semibold text-gray-400">
                          {tx.operatorId ? "Sistema" : "Manual"}
                        </div>

                        <div
                          className={`col-span-1 sm:col-span-2 text-left sm:text-right font-black text-lg ${
                            tx.type === "DEBT"
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {tx.type === "DEBT" ? "+" : "-"} R${" "}
                          {Number(tx.amount).toFixed(2)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400 font-bold">
                      Nenhuma movimentação registrada.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

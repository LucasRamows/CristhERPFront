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
import { Button } from "../../../components/ui/button";
import { formatPhone, formatTime } from "../../../lib/utils";
import {
  type CostomersResponse,
  type LedgerEntry,
} from "../../../services/costomers/customers.service";

export interface PassbookClientDetailsPanelProps {
  activeClient: CostomersResponse | null;
  setActiveClientId: (id: string | null) => void;
  transactions: LedgerEntry[];
  toggleBloqueio: () => void;
  setIsPaymentModalOpen: (open: boolean) => void;
  onEditProfile: () => void;
  handleDeleteTransaction: (
    transactionId: string,
    orderId: string,
    type: string,
  ) => void;
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
      className={`flex-1 flex-col bg-background overflow-hidden relative ${
        !activeClient ? "hidden lg:flex" : "flex"
      }`}
    >
      {!activeClient ? (
        // EMPTY STATE
        <div className="h-full flex flex-col items-center justify-center text-primary p-8 text-center bg-background">
          <div className="w-24 h-24 card-default flex items-center justify-center mb-6">
            <ShieldAlert size={48} className="text-primary" />
          </div>
          <h2 className="text-2xl font-black text-primary mb-2">
            Nenhum cliente selecionado
          </h2>
          <p className="font-medium max-w-sm">
            Selecione um cliente na lista ao lado para ver seu limite, histórico
            de compras e receber pagamentos.
          </p>
        </div>
      ) : (
        // PERFIL DO CLIENTE
        <div className="h-full flex flex-col animate-fade-in p-4 md:p-8 gap-3">
          {/* HEADER DO CLIENTE */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 shrink-0 bg-background">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setActiveClientId(null)}
                className="lg:hidden w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary shrink-0 transition-colors hover:bg-secondary/80"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="relative shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-decoration text-primary font-black text-3xl md:text-4xl">
                  {activeClient.nickname.charAt(0)}
                </div>
              </div>
              <button
                onClick={onEditProfile}
                className="md:hidden ml-auto bg-secondary hover:bg-secondary/80 text-primary px-4 py-2 rounded-xl font-bold text-sm transition-colors shrink-0"
              >
                Editar
              </button>
            </div>

            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-black text-primary truncate">
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
              <p className="text-lg font-bold text-muted-foreground mb-3 truncate">
                {activeClient.fullName}
              </p>

              <div className="flex flex-wrap gap-4 text-sm font-semibold text-muted-foreground">
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
              className="hidden md:flex bg-secondary hover:bg-secondary/80 text-primary px-4 py-2 rounded-xl font-bold text-sm transition-colors shrink-0"
            >
              Editar Perfil
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="bg-card rounded-2xl md:rounded-[32px] p-6 md:p-8 relative overflow-hidden shadow-sm border border-border">
              <div className="absolute top-0 right-0 w-64 h-64 bg-decoration opacity-[0.03] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10">
                <div className="border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-8">
                  <p className="text-muted-foreground font-bold uppercase tracking-wider text-sm mb-2">
                    Saldo Devedor Atual
                  </p>
                  <h3
                    className={`text-4xl md:text-6xl font-black tracking-tight ${
                      activeClient.saldoDevedor > 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    R$ {(Number(activeClient.saldoDevedor) || 0).toFixed(2)}
                  </h3>
                  <div className="mt-4 inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-xl text-primary font-bold text-sm">
                    <History size={16} /> Vencimento todo dia{" "}
                    {activeClient.settlementDate}
                  </div>
                </div>

                {/* Limites */}
                <div className="flex flex-col justify-center gap-6">
                  <div>
                    <p className="text-muted-foreground font-bold uppercase tracking-wider text-xs mb-1">
                      Limite de Crédito Aprovado
                    </p>
                    <p className="text-2xl font-black text-primary">
                      R$ {Number(activeClient.creditLimit || 0).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-bold uppercase tracking-wider text-xs mb-1">
                      Crédito Disponível p/ Compra
                    </p>
                    <p
                      className={`text-3xl font-black ${
                        activeClient.creditLimit - activeClient.saldoDevedor > 0
                          ? "text-decoration"
                          : "text-destructive"
                      }`}
                    >
                      R${" "}
                      {(
                        Number(activeClient.creditLimit || 0) -
                        Number(activeClient.saldoDevedor || 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. BOTÕES DE AÇÃO RÁPIDA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={activeClient.saldoDevedor === 0}
                className="bg-decoration text-decoration-foreground py-3 px-4 md:py-4 md:px-6 rounded-xl md:rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowDownRight size={20} className="md:w-6 md:h-6" /> Receber
                Valor
              </button>

              <button
                onClick={toggleBloqueio}
                className={`border-2 py-3 px-4 md:py-4 md:px-6 rounded-xl md:rounded-2xl font-bold text-base md:text-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm ${
                  activeClient.isBlocked
                    ? "bg-destructive/10 border-destructive text-destructive hover:bg-destructive/20"
                    : "bg-card border-border text-foreground hover:border-destructive hover:text-destructive hover:bg-destructive/10"
                }`}
              >
                <Ban size={20} className="md:w-6 md:h-6" />{" "}
                {activeClient.isBlocked
                  ? "Desbloquear Conta"
                  : "Bloquear Conta"}
              </button>
            </div>
          </div>
          {/* CONTEÚDO SCROLLÁVEL */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* 4. HISTÓRICO DE MOVIMENTAÇÃO (EXTRATO) */}
            <div>
              <h3 className="text-xl font-black text-primary mb-4 flex items-center gap-2">
                <History className="text-primary" /> Extrato do Cliente
              </h3>

              <div className="card-default overflow-hidden">
                {/* Header — só desktop */}
                <div className="hidden sm:grid grid-cols-12 gap-4 p-4 md:p-6 border-b border-border bg-muted/50 text-muted-foreground font-bold text-sm uppercase tracking-wider">
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
                        className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 p-4 md:p-6 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        {/* Linha 1 mobile: botão delete + data */}
                        <div className="flex items-center justify-between sm:col-span-3">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() =>
                              handleDeleteTransaction(
                                tx.id,
                                tx.orderId,
                                tx.type,
                              )
                            }
                          >
                            <Trash />
                          </Button>
                          <span className="text-sm font-bold text-muted-foreground">
                            {formatTime(
                              tx.order?.sale_date
                                ? tx.order.sale_date
                                : tx.createdAt,
                            )}
                          </span>
                        </div>

                        {/* Descrição */}
                        <div className="flex items-center gap-3 sm:col-span-5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              tx.type === "DEBT"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-green-500/10 text-green-500"
                            }`}
                          >
                            {tx.type === "DEBT" ? (
                              <ArrowUpRight size={16} />
                            ) : (
                              <ArrowDownRight size={16} />
                            )}
                          </div>
                          <span className="font-extrabold text-foreground">
                            {tx.description}
                          </span>
                        </div>

                        {/* Operador + Valor — lado a lado no mobile, colunas separadas no desktop */}
                        <div className="flex items-center justify-between sm:contents">
                          <span className="text-sm font-semibold text-muted-foreground sm:col-span-2 sm:text-center">
                            {tx.operatorId ? "Sistema" : "Manual"}
                          </span>
                          <span
                            className={`font-black text-lg sm:col-span-2 sm:text-right ${
                              tx.type === "DEBT"
                                ? "text-destructive"
                                : "text-green-500"
                            }`}
                          >
                            {tx.type === "DEBT" ? "+" : "-"} R${" "}
                            {Number(tx.amount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground font-bold">
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

import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Ban,
  CheckCircle,
  DollarSign,
  Eye,
  History,
  Phone,
  ShieldAlert,
  Trash,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { formatPhone, formatTime } from "../../../lib/utils";
import { usePassbook } from "../hooks/PassbookContext";
import AddDebtSheet from "./sheets/AddDebtSheet";
import CustomerSheet from "./sheets/CustomerSheet";
import { PassbookReceiptWrapper } from "./wrappers/PassbookReceiptWrapper";

export function ClientDetailsModal() {
  const {
    // Dados Principais
    activeClient,
    setActiveClientId,
    ledgerEntries, // Substitui a antiga prop "transactions"

    // Ações de UI e Negócio
    toggleBlockAction, // Substitui toggleBloqueio
    openPaymentModal, // Substitui setIsPaymentModalOpen
    deleteTransactionAction, // Substitui handleDeleteTransaction
    handleViewNote,
    isLoadingOrder,
  } = usePassbook();

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
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 shrink-0 bg-background">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setActiveClientId(null)}
                className="lg:hidden w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary shrink-0 transition-colors hover:bg-secondary/80"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="relative shrink-0">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-decoration text-primary font-black text-2xl md:text-4xl">
                  {activeClient.nickname.charAt(0)}
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                <h2 className="text-2xl md:text-3xl font-black text-primary truncate max-w-full">
                  {activeClient.nickname}
                </h2>
                <span
                  className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide flex items-center gap-1 shrink-0 ${
                    activeClient.isBlocked
                      ? "bg-red-100 text-red-500"
                      : "bg-green-100 text-green-500"
                  }`}
                >
                  {activeClient.isBlocked ? (
                    <>
                      <Ban size={12} className="md:w-3.5 md:h-3.5" /> Bloqueado
                    </>
                  ) : (
                    <>
                      <CheckCircle size={12} className="md:w-3.5 md:h-3.5" /> Ativo
                    </>
                  )}
                </span>
              </div>
              <p className="text-base md:text-lg font-bold text-muted-foreground mb-3 truncate">
                {activeClient.fullName}
              </p>

              <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm font-semibold text-muted-foreground">
                <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-lg md:bg-transparent md:px-0 md:py-0">
                  <DollarSign size={14} className="md:w-4 md:h-4" /> CPF: {activeClient.cpf}
                </div>
                <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-lg md:bg-transparent md:px-0 md:py-0">
                  <Phone size={14} className="md:w-4 md:h-4" /> {formatPhone(activeClient.phone)}
                </div>
              </div>
            </div>

            <div className="flex w-full md:w-auto gap-2 mt-2 md:mt-0">
              <CustomerSheet mode="edit" initialData={activeClient}>
                <button className="flex-1 md:flex-initial flex items-center justify-center bg-secondary hover:bg-secondary/80 text-primary px-4 py-3 md:py-2 rounded-xl font-bold text-sm transition-colors shrink-0">
                  Editar Perfil
                </button>
              </CustomerSheet>

              <div className="flex-1 md:flex-initial flex [&>*]:w-full">
                <AddDebtSheet />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="bg-card rounded-2xl md:rounded-[32px] p-5 md:p-8 relative overflow-hidden shadow-sm border border-border">
              <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-decoration opacity-[0.03] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 relative z-10">
                <div className="border-b md:border-b-0 md:border-r border-border pb-5 md:pb-0 md:pr-8">
                  <p className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] md:text-sm mb-1 md:mb-2">
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
                  <div className="mt-3 md:mt-4 inline-flex items-center gap-1.5 md:gap-2 bg-secondary/50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-primary font-bold text-xs md:text-sm">
                    <History size={14} className="md:w-4 md:h-4" /> Venc. dia{" "}
                    {activeClient.settlementDate}
                  </div>
                </div>

                {/* Limites */}
                <div className="flex flex-row md:flex-col justify-between md:justify-center gap-4 md:gap-6">
                  <div>
                    <p className="text-muted-foreground font-bold uppercase tracking-wider text-[9px] md:text-xs mb-0.5 md:mb-1">
                      Limite Aprovado
                    </p>
                    <p className="text-xl md:text-2xl font-black text-primary">
                      R$ {Number(activeClient.creditLimit || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right md:text-left">
                    <p className="text-muted-foreground font-bold uppercase tracking-wider text-[9px] md:text-xs mb-0.5 md:mb-1">
                      Crédito Disp.
                    </p>
                    <p
                      className={`text-xl md:text-3xl font-black ${
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
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <Button
                onClick={() => openPaymentModal()}
                disabled={activeClient.saldoDevedor === 0}
                className="bg-decoration text-decoration-foreground py-3 px-2 md:py-4 md:px-6 rounded-xl md:rounded-2xl font-black text-sm md:text-lg flex items-center justify-center gap-1.5 md:gap-2 hover:brightness-105 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowDownRight size={16} className="md:w-6 md:h-6" /> Receber
              </Button>

              <Button
                onClick={toggleBlockAction}
                className={`border-2 py-3 px-2 md:py-4 md:px-6 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg flex items-center justify-center gap-1.5 md:gap-2 active:scale-95 transition-all shadow-sm ${
                  activeClient.isBlocked
                    ? "bg-destructive/10 border-destructive text-destructive hover:bg-destructive/20"
                    : "bg-card border-border text-foreground hover:border-destructive hover:text-destructive hover:bg-destructive/10"
                }`}
              >
                <Ban size={16} className="md:w-6 md:h-6" />{" "}
                {activeClient.isBlocked ? "Desbloquear" : "Bloquear"}
              </Button>
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
                <div className="overflow-x-auto custom-scrollbar">
                  <div className="min-w-[800px]">
                    {/* Header — agora visível sempre, graças ao scroll horizontal */}
                    <div className="grid grid-cols-12 gap-4 p-4 md:p-6 border-b border-border bg-muted/50 text-muted-foreground font-bold text-sm uppercase tracking-wider">
                      <div className="col-span-3">Data / Hora</div>
                      <div className="col-span-4">Descrição</div>
                      <div className="col-span-2 text-center">Operador</div>
                      <div className="col-span-2 text-right">Valor</div>
                      <div className="col-span-1 text-center">Ação</div>
                    </div>

                    <div className="flex flex-col">
                      {ledgerEntries?.length > 0 ? (
                        ledgerEntries.map((tx) => (
                          <div
                            key={tx.id}
                            className="grid grid-cols-12 items-center gap-4 p-4 md:p-6 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                          >
                            {/* Delete button + date */}
                            <div className="flex items-center gap-3 col-span-3">
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() =>
                                  deleteTransactionAction(
                                    tx.id,
                                    tx.orderId,
                                  )
                                }
                              >
                                <Trash size={16} />
                              </Button>
                              <span className="text-sm font-semibold text-muted-foreground">
                                {formatTime(
                                  tx.order?.sale_date
                                    ? tx.order.sale_date
                                    : tx.createdAt,
                                )}
                              </span>
                            </div>

                            {/* Icon + description */}
                            <div className="flex items-center gap-2 col-span-4 min-w-0">
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
                                  <ArrowDownLeft size={16} />
                                )}
                              </div>
                              <span className="text-sm font-semibold text-foreground truncate block">
                                {tx.description}
                              </span>
                            </div>

                            {/* Source */}
                            <span className="text-sm font-semibold text-muted-foreground col-span-2 text-center">
                              {tx.operatorId ? "Sistema" : "Manual"}
                            </span>

                            {/* amount */}
                            <span
                              className={`font-bold text-lg col-span-2 text-right truncate block ${
                                tx.type === "DEBT"
                                  ? "text-destructive"
                                  : "text-green-500"
                              }`}
                            >
                              {tx.type === "DEBT" ? "+" : "−"} R${" "}
                              {Number(tx.amount).toFixed(2)}
                            </span>

                            {/* View note button */}
                            <Button
                              size="icon"
                              disabled={tx.type !== "DEBT" || isLoadingOrder}
                              onClick={() => {
                                handleViewNote(tx);
                              }}
                              className="col-span-1 justify-self-center"
                            >
                              <Eye size={16} />
                            </Button>
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
          </div>
        </div>
      )}

      <PassbookReceiptWrapper />
    </div>
  );
}

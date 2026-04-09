import {
  CalendarIcon,
  CheckCircle,
  DownloadCloud,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { useState } from "react";

import { Popover } from "@radix-ui/react-popover";
import {
  PageTabNavigation,
  type TabItem,
} from "../../components/shared/PageTabNavigation";
import { Calendar } from "../../components/ui/calendar";
import { PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { FinancialAccountsPanel } from "../components/financial/FinancialAccountsPanel";
import { FinancialConciliationPanel } from "../components/financial/FinancialConciliationPanel";
import FinancialDailyCashFlowPanel from "../components/financial/FinancialDailyCashFlowPanel";
import { FinancialDrePanel } from "../components/financial/FinancialDrePanel";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
// --- DADOS MOCKADOS ---
const MOCK_CONTAS = {
  pagar: [
    {
      id: 1,
      descricao: "Aluguel do Imóvel",
      vencimento: "10/09",
      valor: 4500.0,
      status: "pendente",
    },
    {
      id: 2,
      descricao: "Folha de Pagamento",
      vencimento: "05/09",
      valor: 12400.0,
      status: "pago",
    },
    {
      id: 3,
      descricao: "Conta de Energia (Enel)",
      vencimento: "15/09",
      valor: 1250.0,
      status: "pendente",
    },
    {
      id: 4,
      descricao: "Fornecedor (Bebidas)",
      vencimento: "12/09",
      valor: 3868.5,
      status: "pendente",
    },
  ],
  receber: [
    {
      id: 5,
      descricao: "Crédito D+30 (Stone)",
      vencimento: "05/09",
      valor: 8540.0,
      status: "recebido",
    },
    {
      id: 6,
      descricao: "Crédito D+30 (Stone)",
      vencimento: "06/09",
      valor: 7200.0,
      status: "pendente",
    },
    {
      id: 7,
      descricao: "Débito D+1 (Cielo)",
      vencimento: "05/09",
      valor: 3100.0,
      status: "recebido",
    },
    {
      id: 8,
      descricao: "iFood (Repasse Semanal)",
      vencimento: "08/09",
      valor: 5400.0,
      status: "pendente",
    },
  ],
};

const MOCK_DRE = [
  { tipo: "receita", label: "Receita Bruta (Vendas)", valor: 85000.0 },
  { tipo: "imposto", label: "Impostos e Deduções", valor: -5100.0 },
  { tipo: "subtotal", label: "Receita Líquida", valor: 79900.0 },
  { tipo: "custo", label: "Custo dos Insumos (CMV)", valor: -25500.0 },
  { tipo: "subtotal", label: "Lucro Bruto", valor: 54400.0 },
  { tipo: "despesa", label: "Despesas Fixas (Aluguel, Luz)", valor: -8500.0 },
  { tipo: "despesa", label: "Despesas com Pessoal", valor: -18000.0 },
  { tipo: "resultado", label: "Lucro Líquido do Mês", valor: 27900.0 }, // ~32% de margem
];

const MOCK_CONCILIACAO = [
  {
    id: 1,
    data: "04/09 20:30",
    adquirente: "Stone",
    tipo: "Crédito",
    valor: 150.0,
    taxaAcordada: 2.5,
    taxaCobrada: 2.5,
    status: "ok",
  },
  {
    id: 2,
    data: "04/09 21:15",
    adquirente: "Cielo",
    tipo: "Débito",
    valor: 85.0,
    taxaAcordada: 1.2,
    taxaCobrada: 1.2,
    status: "ok",
  },
  {
    id: 3,
    data: "04/09 22:00",
    adquirente: "Stone",
    tipo: "Crédito",
    valor: 320.0,
    taxaAcordada: 2.5,
    taxaCobrada: 3.8,
    status: "divergente",
  }, // Erro simulado
  {
    id: 4,
    data: "04/09 22:45",
    adquirente: "iFood",
    tipo: "Online",
    valor: 110.0,
    taxaAcordada: 12.0,
    taxaCobrada: 12.0,
    status: "ok",
  },
];

export default function FinancialManagementPage() {
  const [activeView, setActiveView] = useState("fluxo"); // "contas" | "dre" | "conciliacao" | "contador"

  // Estados para simulação do envio ao contador
  const [exportState, setExportState] = useState("idle");
  const [saleDate, setSaleDate] = useState<Date>(new Date());
  const handleExport = () => {
    setExportState("processing");
    setTimeout(() => {
      setExportState("success");
      setTimeout(() => setExportState("idle"), 3000); // Reseta após 3s
    }, 2000);
  };

  const financialTabs: TabItem[] = [
    // { id: "contas", label: "Contas a Pagar/Receber", icon: DollarSign },
    // { id: "dre", label: "DRE & Caixa", icon: PieChart },
    // { id: "conciliacao", label: "Conciliação", icon: CreditCard },
    // { id: "contador", label: "Fechar Mês (Contador)", icon: FileText },
    { id: "fluxo", label: "Fluxo de Caixa", icon: FileText },
  ];

  // Cálculos rápidos para o dashboard de contas
  const totalPagar = MOCK_CONTAS.pagar
    .filter((c) => c.status === "pendente")
    .reduce((acc, curr) => acc + curr.valor, 0);
  const totalReceber = MOCK_CONTAS.receber
    .filter((c) => c.status === "pendente")
    .reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <div className="flex flex-col w-full gap-4 bg-background select-none">
      {/* TOP NAVBAR (Toggle Switch) */}
      <div className="w-full flex justify-between">
        <PageTabNavigation
          tabs={financialTabs}
          activeTab={activeView}
          onTabChange={setActiveView}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <div className="flex items-center gap-2">
                <CalendarIcon
                  size={18}
                  className={`transition-colors ${
                    saleDate ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span className="text-xs font-black uppercase tracking-widest mt-0.5">
                  {saleDate
                    ? format(saleDate, "dd 'de' MMMM", { locale: ptBR })
                    : "Selecionar Data"}
                </span>
              </div>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto p-3 rounded-[1.5rem] border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl z-50"
            align="end"
          >
            <Calendar
              mode="single"
              selected={saleDate}
              onSelect={(newDate) => {
                if (newDate) {
                  const now = new Date();
                  newDate.setHours(
                    now.getHours(),
                    now.getMinutes(),
                    now.getSeconds(),
                    now.getMilliseconds(),
                  );
                  setSaleDate(newDate);
                }
              }}
              disabled={{ after: new Date() }}
              locale={ptBR}
              initialFocus
              className="p-0"
              classNames={{
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-muted text-accent-foreground",
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex w-full bg-card rounded-xl">
        {/* ÁREA DE CONTEÚDO DINÂMICO */}
        <div className="flex-1 bg-gray-50/50 relative custom-scrollbar">
          {/* VISÃO 1: CONTAS A PAGAR E RECEBER */}
          {activeView === "contas" && (
            <FinancialAccountsPanel
              contas={MOCK_CONTAS}
              totalPagar={totalPagar}
              totalReceber={totalReceber}
            />
          )}

          {/* VISÃO 2: DRE GERENCIAL */}
          {activeView === "dre" && (
            <FinancialDrePanel
              dreData={MOCK_DRE}
              currentMonth="Setembro 2023"
            />
          )}

          {/* VISÃO 3: CONCILIAÇÃO DE CARTÕES */}
          {activeView === "conciliacao" && (
            <FinancialConciliationPanel conciliationData={MOCK_CONCILIACAO} />
          )}

          {/* VISÃO 4: MÓDULO CONTADOR */}
          {activeView === "contador" && (
            <div className="p-4 md:p-8 max-w-4xl mx-auto h-full flex flex-col justify-center animate-fade-in pt-12 md:pt-16">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-[#E2F898] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <FileSpreadsheet size={40} className="text-gray-900" />
                </div>
                <h2 className="text-3xl font-black text-gray-800 mb-4">
                  Fechamento do Mês
                </h2>
                <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
                  Agrupe todos os XMLs de notas (Entrada e Saída) e o arquivo
                  SPED Fiscal em um único ZIP para enviar ao seu contador.
                </p>
              </div>

              <div className="bg-white rounded-[40px] border border-gray-200 shadow-xl p-8 md:p-12">
                <div className="mb-8 border-b border-gray-100 pb-8 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <span className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Mês de Referência
                    </span>
                    <select className="bg-gray-50 border border-gray-200 text-xl font-black text-gray-900 rounded-2xl px-6 py-4 outline-none focus:border-[#44A08D]">
                      <option>Agosto 2023</option>
                      <option>Setembro 2023</option>
                      <option>Outubro 2023</option>
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                      <span className="block text-2xl font-black text-[#44A08D]">
                        842
                      </span>
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        NFC-e Emitidas
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                      <span className="block text-2xl font-black text-red-500">
                        24
                      </span>
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        NF-e de Entrada
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <label className="flex items-center p-5 border-2 border-[#E2F898] bg-[#E2F898]/10 rounded-2xl cursor-pointer hover:bg-[#E2F898]/20 transition-colors">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-6 h-6 rounded text-gray-900 focus:ring-[#E2F898] accent-gray-900"
                    />
                    <span className="ml-4 font-bold text-lg text-gray-900">
                      XMLs Notas de Saída (Vendas)
                    </span>
                  </label>
                  <label className="flex items-center p-5 border-2 border-[#E2F898] bg-[#E2F898]/10 rounded-2xl cursor-pointer hover:bg-[#E2F898]/20 transition-colors">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-6 h-6 rounded text-gray-900 focus:ring-[#E2F898] accent-gray-900"
                    />
                    <span className="ml-4 font-bold text-lg text-gray-900">
                      XMLs Notas de Entrada (Compras)
                    </span>
                  </label>
                  <label className="flex items-center p-5 border-2 border-[#E2F898] bg-[#E2F898]/10 rounded-2xl cursor-pointer hover:bg-[#E2F898]/20 transition-colors">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-6 h-6 rounded text-gray-900 focus:ring-[#E2F898] accent-gray-900"
                    />
                    <span className="ml-4 font-bold text-lg text-gray-900">
                      Arquivo SPED Fiscal
                    </span>
                  </label>
                  <label className="flex items-center p-5 border-2 border-[#E2F898] bg-[#E2F898]/10 rounded-2xl cursor-pointer hover:bg-[#E2F898]/20 transition-colors">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-6 h-6 rounded text-gray-900 focus:ring-[#E2F898] accent-gray-900"
                    />
                    <span className="ml-4 font-bold text-lg text-gray-900">
                      Relatório Resumo em PDF
                    </span>
                  </label>
                </div>

                {exportState === "idle" && (
                  <button
                    onClick={handleExport}
                    className="w-full bg-gray-900 text-white font-black text-2xl py-6 rounded-3xl hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    <DownloadCloud size={28} /> Gerar ZIP e Enviar
                  </button>
                )}

                {exportState === "processing" && (
                  <button
                    disabled
                    className="w-full bg-gray-200 text-gray-500 font-black text-2xl py-6 rounded-3xl flex items-center justify-center gap-3"
                  >
                    <div className="w-8 h-8 border-4 border-gray-400 border-t-gray-800 rounded-full animate-spin"></div>{" "}
                    Compactando arquivos...
                  </button>
                )}

                {exportState === "success" && (
                  <button className="w-full bg-[#44A08D] text-white font-black text-2xl py-6 rounded-3xl flex items-center justify-center gap-3 animate-fade-in shadow-xl">
                    <CheckCircle size={28} /> Arquivos Enviados com Sucesso!
                  </button>
                )}
              </div>
            </div>
          )}

          {/* VISÃO 3: CONCILIAÇÃO DE CARTÕES */}
          {activeView === "fluxo" && (
            <FinancialDailyCashFlowPanel data={saleDate} />
          )}
        </div>
      </div>
    </div>
  );
}

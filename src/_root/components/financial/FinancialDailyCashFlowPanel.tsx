import {
  Banknote,
  CalendarDays,
  CreditCard,
  DollarSign,
  QrCode,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LoadingComponent from "../../../components/shared/LoadingComponent";
import {
  ordersService,
  type DayOrdersResponse,
} from "../../../services/orders/orders.service";
import { DashboardStatCard } from "../dashboard/DashboardStatCard";
import { formatMoney } from "../../../lib/utils";
import { format } from "date-fns";

interface FinancialDailyCashFlowPanelProps {
  data: Date;
}

export default function FinancialDailyCashFlowPanel({
  data,
}: FinancialDailyCashFlowPanelProps) {
  const [orders, setOrders] = useState<DayOrdersResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Buscamos as ordens (vendas fechadas do dia)
        const res = await ordersService.getDayOrders(
          format(data, "yyyy-MM-dd"),
        );
        setOrders(res);
      } catch (error) {
        console.error("Erro ao buscar vendas do dia:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [data]);

  // Cálculos do resumo
  const { totalRevenue, totalTransactions, averageTicket } = useMemo(() => {
    const revenue = orders.reduce(
      (acc, curr) => acc + Number(curr.total || 0),
      0,
    );
    const transactions = orders.length;
    return {
      totalRevenue: revenue,
      totalTransactions: transactions,
      averageTicket: transactions > 0 ? revenue / transactions : 0,
    };
  }, [orders]);

  // Distanciamento simulado / preditivo por método pra manter a UI (já que a API não retornou método explícito)
  const todayFlowData = useMemo(() => {
    const aggregation = {
      PIX: { value: 0, count: 0, label: "PIX", color: "#10b981", icon: QrCode },
      CREDIT_CARD: {
        value: 0,
        count: 0,
        label: "Crédito",
        color: "#3b82f6",
        icon: CreditCard,
      },
      DEBIT_CARD: {
        value: 0,
        count: 0,
        label: "Débito",
        color: "#f59e0b",
        icon: CreditCard,
      },
      CASH: {
        value: 0,
        count: 0,
        label: "Dinheiro",
        color: "#71717a",
        icon: Banknote,
      },
      STORE_CREDIT: {
        value: 0,
        count: 0,
        label: "Caderneta",
        color: "#8b5cf6",
        icon: DollarSign,
      },
    };

    orders.forEach((order) => {
      const method = order.payments?.[0]?.method as keyof typeof aggregation;
      const amount = Number(order.total || 0);

      if (aggregation[method]) {
        aggregation[method].value += amount;
        aggregation[method].count += 1;
      }
    });

    return Object.values(aggregation)
      .filter((item) => item.count > 0)
      .map((item) => ({
        type: item.label,
        value: item.value,
        count: item.count,
        color: item.color,
        icon: item.icon,
      }));
  }, [orders]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-6 p-6 text-foreground overflow-x-hidden">
      {/* ==========================================
          CARDS DE RESUMO (MÉTRICAS PRINCIPAIS)
          ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {/* Card 1: Faturamento Total */}

        <DashboardStatCard
          title="Faturamento Hoje"
          value={formatMoney(totalRevenue)}
          icon={<DollarSign size={20} />}
          color="emerald"
        />

        {/* Card 2: Volume de Transações */}
        <DashboardStatCard
          title="Volume de Vendas"
          value={totalTransactions}
          icon={<CreditCard size={20} />}
          color="blue"
        />

        {/* Card 3: Ticket Médio */}
        <DashboardStatCard
          title="Ticket Médio"
          value={formatMoney(averageTicket)}
          icon={<DollarSign size={20} />}
          color="yellow"
        />
      </div>

      {/* ==========================================
          ÁREA DO GRÁFICO E DETALHAMENTO
          ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* GRÁFICO DE BARRAS (RECEITAS POR TIPO) */}
        <div className="lg:col-span-2 bg-card border rounded-xl p-6 sm:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
                Receitas por Método
              </h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                Distribuição de pagamentos do dia
              </p>
            </div>
          </div>

          <div className="h-[300px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={todayFlowData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  className="opacity-10"
                />
                <XAxis
                  dataKey="type"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fontWeight: 900,
                    fill: "currentColor",
                    opacity: 0.5,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `R$ ${val}`}
                  tick={{
                    fontSize: 10,
                    fontWeight: 700,
                    fill: "currentColor",
                    opacity: 0.5,
                  }}
                />
                <Tooltip
                  cursor={{ fill: "currentColor", opacity: 0.05 }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderRadius: "16px",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: number) => [formatMoney(value), "Valor"]}
                  labelStyle={{
                    fontWeight: 900,
                    color: "hsl(var(--foreground))",
                    marginBottom: "4px",
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[12, 12, 0, 0]}
                  barSize={40}
                  animationDuration={1500}
                >
                  {todayFlowData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DETALHAMENTO EM LISTA */}
        <div className="bg-card border rounded-xl p-6 sm:p-8 flex flex-col h-full">
          <div className="mb-6">
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
              Detalhamento
            </h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              Geral em caixa
            </p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {todayFlowData.map((item) => {
              const Icon = item.icon;
              const percentage =
                totalRevenue > 0
                  ? ((item.value / totalRevenue) * 100).toFixed(1)
                  : "0.0";

              return (
                <div
                  key={item.type}
                  className="group p-4 bg-muted/20 border border-border/50 rounded-[1.5rem] hover:bg-muted/50 transition-all flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                        style={{
                          backgroundColor: `${item.color}15`,
                          color: item.color,
                        }}
                      >
                        <Icon size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-sm uppercase tracking-tight text-foreground">
                          {item.type}
                        </span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                          {item.count} Transações
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-black text-sm text-foreground">
                        {formatMoney(item.value)}
                      </span>
                      <span
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: item.color }}
                      >
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botão de Fechamento de Caixa */}
          <div className="pt-6 mt-auto border-t border-border/50">
            <button className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-2">
              Imprimir Relatório Z
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          GERENCIAMENTO DE VENDAS (TABELA)
          ========================================== */}
      <div className="bg-card border rounded-xl p-6 sm:p-8 flex flex-col w-full">
        <div className="mb-6 flex flex-col gap-1">
          <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
            Vendas Concluídas
          </h3>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            Acompanhamento profissional das transações e pedidos do dia
          </p>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="pb-4 font-bold">Referência</th>
                <th className="pb-4 font-bold">Data/Hora</th>
                <th className="pb-4 font-bold">Tipo</th>
                <th className="pb-4 font-bold text-right">Itens</th>
                <th className="pb-4 font-bold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                return (
                  <tr
                    key={order.id}
                    className="border-b border-border/10 hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-5">
                      <span className="font-black text-sm uppercase tracking-tight text-foreground">
                        {order.reference || `#${order.id.slice(0, 6)}`}
                      </span>
                    </td>
                    <td className="py-5">
                      <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                        <CalendarDays size={14} className="opacity-50" />
                        {new Date(order.openedAt).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="py-5">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/10 inline-flex">
                        {order.payments[0].method === "PIX"
                          ? "PIX"
                          : order.payments[0].method === "CREDIT_CARD"
                          ? "Cartão Crédito"
                          : order.payments[0].method === "DEBIT_CARD"
                          ? "Cartão Débito"
                          : order.payments[0].method === "CASH"
                          ? "Dinheiro"
                          : order.payments[0].method === "STORE_CREDIT"
                          ? "Caderneta"
                          : "Outro"}
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <div className="flex flex-col items-end gap-1">
                        {order.items?.map((item) => (
                          <span
                            key={item.id}
                            className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight"
                          >
                            {item.quantity}x {item.product.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-5 text-right">
                      <span className="font-black text-sm text-foreground">
                        {formatMoney(Number(order.total || 0))}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-2xl mt-6 gap-3">
              <Banknote
                size={32}
                className="text-muted-foreground opacity-50"
              />
              <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">
                Nenhuma venda registrada ainda
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

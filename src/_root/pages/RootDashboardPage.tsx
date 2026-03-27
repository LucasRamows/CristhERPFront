import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronRight,
  DollarSign,
  ShoppingBag,
  Utensils
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LoadingComponent from "../../components/shared/LoadingComponent";
import { Card } from "../../components/ui/card";
import { useAuthenticatedUser } from "../../contexts/DataContext";
import { formatMoney } from "../../lib/utils";
import {
  DashboardcalcFaturamentoHoje,
  DashboardcalcOccupancyPercentage,
  DashboardcalcTicketMedio,
} from "../../services/math/dashboard.service";
import type { OpenOrdersResponse } from "../../services/orders/orders.service";
import {
  ordersService,
  type OrdersHistorySalesResponse,
} from "../../services/orders/orders.service";
import { DashboardOrderItem } from "../components/dashboard/DashboardOrderItem";
import { DashboardStatCard } from "../components/dashboard/DashboardStatCard";

const RootDashboardPage = () => {
  const { data: user } = useAuthenticatedUser();
  const [ordersHistorySales, setOrdersHistorySales] = useState<
    OrdersHistorySalesResponse[]
  >([]);
  const [openOrders, setOpenOrders] = useState<OpenOrdersResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Estado local para gerenciar a entrega sem alterar o banco
  const [localDeliveredOrders, setLocalDeliveredOrders] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("@CristhERP:delivered_orders");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("@CristhERP:delivered_orders", JSON.stringify(localDeliveredOrders));
  }, [localDeliveredOrders]);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [historyRes, openOrdersRes] = await Promise.all([
          ordersService.getOrdersHistorySales(),
          ordersService.openOrders(),
        ]);
        setOrdersHistorySales(historyRes);
        setOpenOrders(openOrdersRes);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const occupiedTables = openOrders.filter(
    (o) => o.orderType === "TABLE",
  ).length;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className="flex gap-4 flex-col w-full bg-background overflow-hidden select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          title="Faturamento Hoje"
          value={formatMoney(DashboardcalcFaturamentoHoje(ordersHistorySales))}
          icon={<DollarSign size={20} />}
          color="emerald"
        />

        <DashboardStatCard
          title="Ticket Médio"
          value={formatMoney(DashboardcalcTicketMedio(ordersHistorySales))}
          icon={<ShoppingBag size={20} />}
          color="blue"
        />
        <DashboardStatCard
          title="Ocupação Atual"
          value={`${DashboardcalcOccupancyPercentage(
            occupiedTables,
            user?.restaurant?.totalTables || 1,
          )}%`}
          trend={`${occupiedTables} mesas`}
          icon={<Utensils size={20} />}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRÁFICO DE FLUXO */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-primary">
                Fluxo de Pedidos
              </h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                Salão vs Delivery
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-emerald-500" /> Delivery
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-zinc-300" /> Salão
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersHistorySales}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#A1A1AA" }}
                  minTickGap={30}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#A1A1AA" }}
                />

                {/* Tooltip personalizado para formatar data e valores */}
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />

                {/* Área para Quantidade de Vendas */}
                <Area
                  name="Qtd. Vendas"
                  type="monotone"
                  dataKey="vendas" // Ajustado para o seu novo JSON
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorVendas)"
                  strokeWidth={3}
                />

                {/* Se quiser mostrar o faturamento no mesmo gráfico: */}
                <Area
                  name="Faturamento (R$)"
                  type="monotone"
                  dataKey="faturamento" // Ajustado para o seu novo JSON
                  stroke="#71717a"
                  fillOpacity={0.05}
                  fill="#71717a"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* FEED DE ATIVIDADE / ALERTAS COZINHA */}
        <Card className="p-6 bg-card shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-5 bg-[#DCFF79] rounded-full block" />
            <span className="text-primary uppercase">Status da Cozinha</span>
          </h3>
          <div className="space-y-4 h-full overflow-y-auto">
            {openOrders
              .filter((order) => !localDeliveredOrders.includes(order.id))
              .sort(
                (a, b) =>
                  new Date(b.openedAt).getTime() -
                  new Date(a.openedAt).getTime(),
              )
              .slice(0, 5)
              .map((order) => {
                const itemsSummary = order.items
                  .map((i) => `${i.quantity}x ${i.product.name}`)
                  .join(", ");

                const timeElapsed = formatDistanceToNow(
                  new Date(order.openedAt),
                  { addSuffix: false, locale: ptBR },
                );

                const getStatusLabel = (status: string) => {
                  switch (status.toLowerCase()) {
                    case "open":
                      return "Novo";
                    case "awaiting":
                      return "Preparando";
                    case "closing":
                      return "Fechando";
                    default:
                      return status;
                  }
                };

                const handleMarkDelivered = () => {
                  try {
                    // Atualiza apenas localmente (navegador) para nao inundar o banco
                    setLocalDeliveredOrders((prev) => [...prev, order.id]);
                  } catch (err) {
                    console.error("Erro ao atualizar status:", err);
                  }
                };

                return (
                  <DashboardOrderItem
                    key={order.id}
                    table={
                      order.orderType === "TABLE"
                        ? `Mesa ${order.reference}`
                        : order.orderType === "CARD"
                        ? `Comanda ${order.reference}`
                        : order.orderType === "DELIVERY"
                        ? `Delivery #${order.reference}`
                        : "Balcão"
                    }
                    time={timeElapsed}
                    status={getStatusLabel(order.status)}
                    items={itemsSummary || "Nenhum item"}
                    onMarkDelivered={handleMarkDelivered}
                    className="uppercase animate-in fade-in slide-in-from-bottom-2"
                  />
                );
              })}

            {/* Ajuste no estado vazio para usar cores do seu tema */}
            {openOrders.filter((o) => !localDeliveredOrders.includes(o.id)).length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
                <p className="text-muted-foreground font-medium uppercase text-sm">
                  Nenhum pedido em andamento
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate("/root/sales")}
            className="w-full mt-8 py-3 bg-[#DCFF79] hover:bg-[#c9ea6b] text-primary rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 uppercase shadow-sm"
          >
            Ver Monitor de Pedidos{" "}
            <ChevronRight size={18} className="text-primary" />
          </button>
        </Card>
      </div>
    </div>
  );
};

export default RootDashboardPage;

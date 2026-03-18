import {
  Badge,
  ChevronRight,
  Clock,
  DollarSign,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card } from "../../components/ui/card";
import { useEffect, useState } from "react";
import LoadingComponent from "../../components/shared/LoadingComponent";
import {
  ordersService,
  type OrdersHistorySalesResponse,
} from "../../services/orders/orders.service";
import { formatMoney } from "../../lib/utils";
import { useAuthenticatedUser } from "../../contexts/DataContext";
import type { OpenOrdersResponse } from "../../services/orders/orders.service";
import { useNavigate } from "react-router-dom";

const RootDashboardPage = () => {
  const { data: user } = useAuthenticatedUser();
  const [ordersHistorySales, setOrdersHistorySales] = useState<
    OrdersHistorySalesResponse[]
  >([]);
  const [openOrders, setOpenOrders] = useState<OpenOrdersResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
  const totalTables = user?.restaurant?.totalTables || 10;
  const occupancyPercentage =
    totalTables > 0 ? Math.round((occupiedTables / totalTables) * 100) : 0;

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
        <StatCard
          title="Faturamento Hoje"
          value={formatMoney(
            ordersHistorySales?.find(
              (s) => s.date === new Date().toISOString().split("T")[0],
            )?.faturamento || 0,
          )}
          icon={<DollarSign size={20} />}
          color="emerald"
        />

        <StatCard
          title="Ticket Médio"
          value={formatMoney(
            (() => {
              const totalFaturamento = ordersHistorySales.reduce(
                (acc, s) => acc + s.faturamento,
                0,
              );
              const totalVendas = ordersHistorySales.reduce(
                (acc, s) => acc + s.vendas,
                0,
              );
              return totalVendas > 0 ? totalFaturamento / totalVendas : 0;
            })(),
          )}
          icon={<ShoppingBag size={20} />}
          color="blue"
        />
        <StatCard
          title="Ocupação Atual"
          value={`${occupancyPercentage}%`}
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
              <h3 className="text-lg font-bold text-zinc-800">
                Fluxo de Pedidos
              </h3>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">
                Salão vs Delivery
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-600">
                <div className="w-3 h-3 rounded-full bg-emerald-500" /> Delivery
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-600">
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
                  dataKey="date" // Mantém date pois seu JSON envia "date"
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
        <Card className="p-6">
          <h3 className="text-lg font-bold text-zinc-800 mb-6">
            Status da Cozinha
          </h3>
          <div className="space-y-4">
            {openOrders
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
                  {
                    addSuffix: false,
                    locale: ptBR,
                  },
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

                return (
                  <OrderItem
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
                  />
                );
              })}

            {openOrders.length === 0 && (
              <div className="text-center py-8 text-zinc-400 font-medium">
                Nenhum pedido em andamento
              </div>
            )}
          </div>
          <button
            onClick={() => navigate("/root/sales")}
            className="w-full mt-8 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            Ver Monitor de Pedidos <ChevronRight size={16} />
          </button>
        </Card>
      </div>
    </div>
  );
};

// --- COMPONENTES ATOMICOS ---

const StatCard = ({ title, value, trend, icon, color }: any) => {
  const colors: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Card className="p-6 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-black text-zinc-900">{value}</h4>
            <span className="text-[10px] font-black text-emerald-500">
              {trend}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const OrderItem = ({ table, time, status, items }: any) => (
  <div className="group p-4 rounded-2xl border border-zinc-100 hover:border-zinc-200 transition-all cursor-pointer">
    <div className="flex justify-between items-start mb-2">
      <span className="font-black text-zinc-800">{table}</span>
      <Badge>{status}</Badge>
    </div>
    <p className="text-xs text-zinc-500 font-medium mb-3">{items}</p>
    <div className="flex items-center gap-1.5 text-zinc-400">
      <Clock size={12} />
      <span className="text-[10px] font-bold uppercase">{time} em espera</span>
    </div>
  </div>
);

export default RootDashboardPage;

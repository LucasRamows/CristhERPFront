// src/_features/dashboard/components/RestaurantDashboard.tsx
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronRight, DollarSign, ShoppingBag, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { StatCard } from "../../../components/shared/StatCard";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { useAuthenticatedUser } from "../../../contexts/DataContext";
import { formatMoney } from "../../../lib/utils";
import { DashboardcalcFaturamentoHoje, DashboardcalcOccupancyPercentage, DashboardcalcTicketMedio } from "../../../services/math/dashboard.service";
import { KitchenOrderCard } from "../components/KitchenOrderCard";
import { useDashboard } from "../hooks/DashboardContext";

export function RestaurantDashboard() {
  const navigate = useNavigate();
  const { ordersHistorySales, openOrders } = useDashboard();
  const { totalTables } = useAuthenticatedUser();

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

  const occupiedTables = openOrders.filter((o) => o.orderType === "TABLE").length;

  return (
    <div className="flex gap-4 flex-col w-full">
      {/* STATS RESTAURANT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Faturamento Hoje"
          value={formatMoney(DashboardcalcFaturamentoHoje(ordersHistorySales))}
          icon={<DollarSign size={20} />}
          color="emerald"
        />
        <StatCard
          title="Ticket Médio"
          value={formatMoney(DashboardcalcTicketMedio(ordersHistorySales))}
          icon={<ShoppingBag size={20} />}
          color="blue"
        />
        <StatCard
          title="Ocupação Atual"
          value={`${DashboardcalcOccupancyPercentage(occupiedTables, totalTables || 1)}%`}
          trend={`${occupiedTables} mesas`}
          icon={<Utensils size={20} />}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRÁFICO RESTAURANT */}
        <Card className="lg:col-span-2 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-primary">Fluxo de Pedidos</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Salão vs Delivery</p>
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={(v) => format(new Date(v), "dd/MM")} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#A1A1AA" }} minTickGap={30} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#A1A1AA" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  formatter={(value: any, name: string) => name === "Faturamento" ? formatMoney(Number(value)) : value}
                  labelFormatter={(v) => format(new Date(v), "dd/MM")}
                />
                <Area name="Qtd. Vendas" type="monotone" dataKey="vendas" stroke="#10b981" fillOpacity={1} fill="url(#colorVendas)" strokeWidth={3} />
                <Area name="Faturamento" type="monotone" dataKey="faturamento" stroke="#71717a" fillOpacity={0.05} fill="#71717a" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* FEED DE ATIVIDADE COZINHA */}
        <Card className="p-6 bg-card shadow-sm flex flex-col h-full">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-5 bg-[#DCFF79] rounded-full block" />
            <span className="text-primary uppercase">Status da Cozinha</span>
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto pb-4">
            {openOrders
              .filter((order) => !localDeliveredOrders.includes(order.id))
              .sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime())
              .slice(0, 5)
              .map((order) => {
                const itemsSummary = order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(", ");
                const timeElapsed = formatDistanceToNow(new Date(order.openedAt), { addSuffix: false, locale: ptBR });

                const getStatusLabel = (status: string) => {
                  switch (status.toLowerCase()) {
                    case "open": return "Novo";
                    case "awaiting": return "Preparando";
                    case "closing": return "Fechando";
                    default: return status;
                  }
                };

                return (
                  <KitchenOrderCard
                    key={order.id}
                    table={
                      order.orderType === "TABLE" ? `Mesa ${order.reference}`
                        : order.orderType === "CARD" ? `Comanda ${order.reference}`
                        : order.orderType === "DELIVERY" ? `Delivery #${order.reference}`
                        : "Balcão"
                    }
                    time={timeElapsed}
                    status={getStatusLabel(order.status)}
                    items={itemsSummary || "Nenhum item"}
                    onMarkDelivered={() => setLocalDeliveredOrders((prev) => [...prev, order.id])}
                    className="uppercase animate-in fade-in slide-in-from-bottom-2"
                  />
                );
              })}

            {openOrders.filter((o) => !localDeliveredOrders.includes(o.id)).length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
                <p className="text-muted-foreground font-medium uppercase text-sm">
                  Nenhum pedido em andamento
                </p>
              </div>
            )}
          </div>
          <Button onClick={() => navigate("/root/sales")} className="w-full mt-auto">
            Ver Monitor de Pedidos <ChevronRight size={18} className="text-primary ml-2" />
          </Button>
        </Card>
      </div>
    </div>
  );
}
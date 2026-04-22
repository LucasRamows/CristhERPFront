// src/_features/dashboard/components/RetailDashboard.tsx
import { format } from "date-fns";
import { DollarSign, ShoppingBag } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { StatCard } from "../../../components/shared/StatCard";
import { Card } from "../../../components/ui/card";
import { formatMoney } from "../../../lib/utils";
import { DashboardcalcFaturamentoHoje, DashboardcalcTicketMedio } from "../../../services/math/dashboard.service";
import { useDashboard } from "../hooks/DashboardContext";

export function RetailDashboard() {
  const {ordersHistorySales} = useDashboard();
  return (
    <div className="flex gap-4 flex-col w-full">
      {/* STATS RETAIL */}
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
      </div>

      {/* GRÁFICO RETAIL */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-primary">Fluxo de Vendas</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                Vendas vs Faturamento
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-emerald-500" /> Vendas
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-zinc-300" /> Faturamento
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
      </div>
    </div>
  );
}
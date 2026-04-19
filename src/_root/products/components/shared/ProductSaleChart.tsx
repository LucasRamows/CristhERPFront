"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface SalesDataPoint {
  sales_date: string;
  quantity: number;
  [key: string]: any;
}

interface ProductSalesChartProps {
  salesData: SalesDataPoint[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  height?: number;
  color?: string;
}

export function ProductSalesChart({
  salesData,
  isLoading = false,
  title = "Volume de Vendas",
  subtitle = "Desempenho Semanal",
  height = 120,
  color = "#DCFF79",
}: ProductSalesChartProps) {
  // Formata as datas para exibição no gráfico (caso ainda não esteja formatado)
  const formattedData = salesData.map((item) => ({
    ...item,
    sales_date:
      typeof item.sales_date === "string" && item.sales_date.length > 10
        ? format(new Date(item.sales_date), "dd/MM", { locale: ptBR })
        : item.sales_date,
    quantity: Number(item.quantity) || 0,
  }));

  return (
    <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
            {subtitle}
          </p>
          <h4 className="text-lg font-black text-zinc-800">{title}</h4>
        </div>

        {!isLoading && (
          <div className="bg-[#DCFF79] px-3 py-1 rounded-full text-[10px] font-black text-zinc-900 uppercase tracking-wider">
            Real time
          </div>
        )}
      </div>

      {/* Área do Gráfico */}
      <div
        className="w-full flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Sincronizando...
            </span>
          </div>
        ) : formattedData.length === 0 ? (
          <div className="text-center text-zinc-400">
            <p className="text-sm font-medium">Sem dados de vendas ainda</p>
            <p className="text-[10px] mt-1">As vendas aparecerão aqui</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="sales_date" hide />

              <Tooltip
                labelStyle={{ color: "#94a3b8", fontSize: "11px" }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "10px 14px",
                }}
              />

              <Area
                type="monotone"
                dataKey="quantity"
                stroke={color}
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorSales)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
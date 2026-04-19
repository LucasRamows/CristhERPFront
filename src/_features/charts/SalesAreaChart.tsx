"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartSeries {
  key: string;                    // nome do campo no objeto (ex: "quantity", "vendas", "faturamento")
  name: string;                   // nome que aparece na legenda e tooltip
  color: string;                  // cor da linha/área
  strokeWidth?: number;
  fillOpacity?: number;
  isMain?: boolean;               // área principal (gradiente mais forte)
}

interface SalesAreaChartProps {
  // Dados crus vindos do backend
  data: any[];

  // Configuração dos eixos e séries
  xKey: string;                   // Campo da data (ex: "sales_date", "date", "createdAt")
  series: ChartSeries[];

  // Textos
  title: string;
  subtitle?: string;

  // Aparência
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;

  // Formatação
  dateFormat?: string;
  valueFormatter?: (value: number, seriesKey: string) => string | number;
}

export function SalesAreaChart({
  data,
  xKey,
  series,
  title,
  subtitle,
  height = 300,
  showGrid = true,
  showLegend = true,
  isLoading = false,
  emptyMessage = "Sem dados disponíveis no período",
  dateFormat = "dd/MM",
  valueFormatter = (value) => value,
}: SalesAreaChartProps) {
  if (isLoading) {
    return (
      <div className="bg-card p-6 rounded-3xl border border-border flex items-center justify-center min-h-[380px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Carregando gráfico...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-card p-6 rounded-3xl border border-border flex flex-col items-center justify-center min-h-[380px] text-center">
        <p className="text-muted-foreground font-medium">{emptyMessage}</p>
      </div>
    );
  }

  // Formata a data para o eixo X
  const formattedData = data.map((item) => ({
    ...item,
    [xKey]:
      typeof item[xKey] === "string" && item[xKey].length > 10
        ? format(new Date(item[xKey]), dateFormat, { locale: ptBR })
        : item[xKey],
  }));

  return (
    <div className="bg-card p-6 rounded-3xl border border-border">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Legenda */}
        {showLegend && series.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {series.map((s) => (
              <div key={s.key} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                {s.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gráfico */}
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f1f1"
              />
            )}

            <XAxis
              dataKey={xKey}
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

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                padding: "12px 16px",
              }}
              formatter={(value: any, name: string, props: any) => [
                valueFormatter(value, props.dataKey),
                name,
              ]}
            />

            {series.map((s, index) => {
              const isMain = s.isMain ?? index === 0;

              return (
                <Area
                  key={s.key}
                  name={s.name}
                  type="monotone"
                  dataKey={s.key}
                  stroke={s.color}
                  strokeWidth={s.strokeWidth ?? (isMain ? 3 : 2)}
                  fillOpacity={s.fillOpacity ?? (isMain ? 0.35 : 0.08)}
                  fill={s.color}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
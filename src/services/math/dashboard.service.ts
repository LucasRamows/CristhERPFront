import type { OrdersHistorySalesResponse } from "../orders/orders.service";

// const { data: user } = useAuthenticatedUser();

export const DashboardcalcTicketMedio = (
  ordersHistorySales: OrdersHistorySalesResponse[],
) => {
  const totalFaturamento = ordersHistorySales.reduce(
    (acc, s) => acc + s.faturamento,
    0,
  );
  const totalVendas = ordersHistorySales.reduce((acc, s) => acc + s.vendas, 0);
  return totalVendas > 0 ? totalFaturamento / totalVendas : 0;
};
export const DashboardcalcOccupancyPercentage = (
  occupiedTables: number,
  totalTables: number,
) => {
  if (!totalTables) return 0;
  return Math.round((occupiedTables / totalTables) * 100);
};

export const DashboardcalcFaturamentoHoje = (
  ordersHistorySales: OrdersHistorySalesResponse[],
) => {
  return ordersHistorySales?.find(
    (s) => s.date === new Date().toISOString().split("T")[0],
  )?.faturamento || 0;
};

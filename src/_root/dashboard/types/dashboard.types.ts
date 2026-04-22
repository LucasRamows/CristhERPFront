import type { OpenOrdersResponse, OrdersHistorySalesResponse } from "../../../services/orders/orders.service";

export interface KitchenOrderCardProps {
  table: string;
  time: string;
  status: string;
  items: string;
  className?: string;
  onMarkDelivered?: () => void;
}
export interface DashboardContextData {
  ordersHistorySales: OrdersHistorySalesResponse[];
  openOrders: OpenOrdersResponse[];
  isLoadingData: boolean;
  refreshData: () => Promise<void>;
}

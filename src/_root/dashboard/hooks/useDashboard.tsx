import { useState, useEffect } from "react";
import { ordersService, type OrdersHistorySalesResponse, type OpenOrdersResponse } from "../../../services/orders/orders.service";

export function useDashboardData() {
  const [ordersHistorySales, setOrdersHistorySales] = useState<OrdersHistorySalesResponse[]>([]);
  const [openOrders, setOpenOrders] = useState<OpenOrdersResponse[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoadingData(true);
        const [historyRes, openOrdersRes] = await Promise.all([
          ordersService.getOrdersHistorySales(),
          ordersService.openOrders(),
        ]);
        setOrdersHistorySales(historyRes);
        setOpenOrders(openOrdersRes);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchDashboardData();
  }, []);

  return { ordersHistorySales, openOrders, isLoadingData };
}
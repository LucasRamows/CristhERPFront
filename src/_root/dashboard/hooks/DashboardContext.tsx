import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  ordersService,
  type OpenOrdersResponse,
  type OrdersHistorySalesResponse
} from "../../../services/orders/orders.service";
import type { DashboardContextData } from "../types/dashboard.types";
const DashboardContext = createContext<DashboardContextData | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [ordersHistorySales, setOrdersHistorySales] = useState<OrdersHistorySalesResponse[]>([]);
  const [openOrders, setOpenOrders] = useState<OpenOrdersResponse[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardContext.Provider 
      value={{ 
        ordersHistorySales, 
        openOrders, 
        isLoadingData, 
        refreshData: fetchDashboardData 
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  
  if (!context) {
    throw new Error("useDashboard deve ser usado dentro de um DashboardProvider");
  }
  
  return context;
}
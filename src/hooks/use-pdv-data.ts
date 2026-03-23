import { useMemo } from "react";
import type { PdvEntity } from "../_root/types/PdvEntity";

export const usePdvData = (totalTables: number, openOrders: any[]) => {
  
  // Tipamos o useMemo como um array de PdvEntity
  const tables = useMemo<PdvEntity[]>(() => {
    const ordersByTable = openOrders.reduce((acc, order) => {
      if (order.orderType === "TABLE") {
        acc[order.reference] = order;
      }
      return acc;
    }, {} as Record<string, any>);

    return Array.from({ length: totalTables }, (_, i): PdvEntity => {
      const mesaNum = (i + 1).toString();
      const order = ordersByTable[mesaNum];

      return {
        id: order?.id || `mesa_${mesaNum}`,
        orderType: "TABLE", // O TS já aceita porque a interface exige OrderType
        name: `MESA ${mesaNum}`,
        reference: mesaNum,
        label: `MESA ${mesaNum}`,
        status: order ? order.status.toLowerCase() : "available",
        total: Number(order?.total) || 0,
        openedAt: order?.openedAt || null,
        items: order?.items || [],
      };
    });
  }, [totalTables, openOrders]);

  const comandas = useMemo<PdvEntity[]>(() => {
    return openOrders
      .filter((o) => o.orderType === "CARD")
      .map((order): PdvEntity => ({
        id: order.id,
        orderType: "CARD",
        name: `COMANDA ${order.reference}`,
        reference: order.reference,
        label: `CMD ${order.reference}`,
        status: order.status.toLowerCase(),
        total: Number(order.total) || 0,
        openedAt: order?.openedAt,
        items: order.items || [],
      }))
      .sort((a, b) => 
        new Date(b.openedAt!).getTime() - new Date(a.openedAt!).getTime()
      );
  }, [openOrders]);

  return { tables, comandas };
};
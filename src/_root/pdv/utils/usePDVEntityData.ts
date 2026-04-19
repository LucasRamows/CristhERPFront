// usePDVEntityData.ts — Derives PdvEntity lists (tables, comandas) from raw openOrders state.
// Moved from hooks/usePDVData.ts and renamed for clarity.

import { useMemo } from "react";
import type { PdvEntity } from "../../types/PdvEntity";

export const usePDVEntityData = (totalTables: number, openOrders: PdvEntity[]) => {
  const tables = useMemo<PdvEntity[]>(() => {
    const ordersByTable = openOrders.reduce(
      (acc: Record<string, any>, order) => {
        if (order.orderType === "TABLE") {
          acc[order.reference] = order;
        }
        return acc;
      },
      {},
    );

    return Array.from({ length: totalTables }, (_, i) => {
      const mesaNum = (i + 1).toString();
      const order = ordersByTable[mesaNum];

      return {
        id: order?.id || `mesa_${mesaNum}`,
        orderType: "TABLE" as const,
        name: order?.name || `Mesa ${mesaNum}`,
        label: `MESA ${mesaNum}`,
        reference: mesaNum,
        status: (order ? String(order.status).toLowerCase() : "available") as PdvEntity["status"],
        total: Number(order?.total) || 0,
        subtotal: Number(order?.subtotal) || 0,
        discount: Number(order?.discount) || 0,
        serviceTax: Number(order?.serviceTax) || 0,
        openedAt: order?.openedAt,
        items: order?.items || [],
      };
    });
  }, [totalTables, openOrders]);

  const comandas = useMemo<PdvEntity[]>(() => {
    return openOrders
      .filter((o) => o.orderType === "CARD")
      .map(
        (order): PdvEntity => ({
          id: order.id,
          orderType: "CARD" as const,
          name: order.name || `Comanda ${order.reference}`,
          label: `CMD ${order.reference}`,
          reference: order.reference,
          status: order.status,
          total: Number(order.total) || 0,
          subtotal: Number(order.subtotal) || 0,
          discount: Number(order.discount) || 0,
          serviceTax: Number(order.serviceTax) || 0,
          openedAt: order?.openedAt,
          items: order.items || [],
        }),
      )
      .sort(
        (a, b) =>
          new Date(b.openedAt || 0).getTime() -
          new Date(a.openedAt || 0).getTime(),
      );
  }, [openOrders]);

  return { tables, comandas };
};

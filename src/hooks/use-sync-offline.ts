import { useCallback, useEffect } from "react";
import { ordersService } from "../services/orders/orders.service";

export const useOfflineSync = (
  user: { id: string } | null,
  setOrders: React.Dispatch<React.SetStateAction<Record<string, any[]>>>,
) => {
  const syncOrders = useCallback(async () => {
    if (!navigator.onLine || !user?.id) return;

    const saved = localStorage.getItem("@CristhERP:draft_orders");
    if (!saved) return;

    const allOrders = JSON.parse(saved);
    const tempIds = Object.keys(allOrders).filter((id) =>
      id.startsWith("temp_"),
    );

    if (tempIds.length === 0) return;

    for (const id of tempIds) {
      try {
        const items = allOrders[id];
        if (!items || items.length === 0) continue;

        await ordersService.createOrder({
          orderType: "COUNTER",
          reference: "Balcão",
          operatorId: user.id,
          sale_date: new Date().toISOString(),
          items: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        });

        setOrders((prev) => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });

        console.log(
          `[CristhERP] Venda offline ${id} sincronizada com sucesso.`,
        );
      } catch (error) {
        console.error(`[CristhERP] Falha ao sincronizar ${id}:`, error);
      }
    }
  }, [user?.id, setOrders]);

  useEffect(() => {
    window.addEventListener("online", syncOrders);
    if (navigator.onLine && user?.id) {
      syncOrders();
    }

    return () => window.removeEventListener("online", syncOrders);
  }, [syncOrders, user?.id]);

  return { syncOrders };
};

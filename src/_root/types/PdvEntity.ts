export type OrderType = "TABLE" | "CARD" | "COUNTER" | "DELIVERY";
export interface PdvEntity {
  id: string;
  orderType: OrderType;
  name: string;
  reference: string;
  label: string;
  status: "available" | "open" | "awaiting" | "closing" | "paid" | "canceled";
  total: number;
  items?: any[];
  openedAt?: string;
}

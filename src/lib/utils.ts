import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { OpenOrdersResponse } from "../services/orders/orders.service";
import type { PdvEntity, OrderType } from "../_root/types/PdvEntity";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatCEP(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
}

function formatDocument(value: string) {
  const numbers = value.replace(/\D/g, "");

  if (numbers.length <= 11) {
    return numbers
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
      .slice(0, 14);
  }

  return numbers
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
}

function isValidDocument(value?: string) {
  if (!value) return false;

  const clean = value.replace(/\D/g, "");
  return clean.length === 14;
}

function formatMoney(value: string | number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const formatPhone = (phone: string) => {
  let digits = phone.replace(/\D/g, "");
  digits = digits.slice(0, 11);
  let formatted = "";
  if (digits.length > 0) {
    if (digits.length <= 2) {
      formatted = `(${digits}`;
    } else if (digits.length <= 6) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(
        6,
      )}`;
    } else {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(
        7,
      )}`;
    }
  }
  return formatted;
};

function removeMask(value: string) {
  return value.replace(/\D/g, "");
}

function formatTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isDeepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  )
    return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key]))
      return false;
  }

  return true;
}

const mapOrderToPdvEntity = (order: OpenOrdersResponse): PdvEntity => {
  const isTable = order.orderType === "TABLE";
  const isCard = order.orderType === "CARD";

  return {
    ...order,
    orderType: order.orderType as OrderType,
    status: order.status.toLowerCase() as any,
    total: parseFloat(order.total),
    subtotal: parseFloat(order.subtotal || "0"),
    discount: parseFloat(order.discount || "0"),
    serviceTax: parseFloat(order.serviceTax || "0"),

    name: isTable
      ? `MESA ${order.reference}`
      : isCard
      ? `COMANDA ${order.reference}`
      : `VENDA ${order.reference}`,

    label: isTable ? `MESA ${order.reference}` : `CMD ${order.reference}`,
  };
};
export {
  formatCEP,
  isDeepEqual,
  formatDocument,
  isValidDocument,
  formatMoney,
  formatPhone,
  removeMask,
  formatTime,
  mapOrderToPdvEntity,
};

import {
  BadgeDollarSign,
  BookUser,
  LayoutDashboard,
  PackageSearch,
  ShoppingCart,
  Truck,
  Users,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import type { User } from "../contexts/DataContext";
import type { PDVView } from "../_root/pdv/types/pdv.types";

export interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
  roles: Array<User["role"]>;
  businessType: string;
}
export interface TabItem {
  id: PDVView | string;
  label: string;
  businessType: string;
}

export const sidebarNavigation: NavItem[] = [
  {
    name: "Visão Geral",
    url: "/root/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "OWNER", "MANAGER", "CASHIER"],
    businessType: "ALL",
  },
  {
    name: "Ponto de Venda",
    url: "/root/sales",
    icon: ShoppingCart,
    roles: ["ADMIN", "OWNER", "MANAGER", "CASHIER"],
    businessType: "ALL",
  },
  {
    name: "Cardápio",
    url: "/root/menu",
    icon: Utensils,
    roles: ["ADMIN", "OWNER", "MANAGER", "CASHIER"],
    businessType: "FOOD_AND_BEVERAGE",
  },
  {
    name: "Produtos",
    url: "/root/menu",
    icon: PackageSearch,
    roles: ["ADMIN", "OWNER", "MANAGER", "CASHIER"],
    businessType: "RETAIL",
  },
  {
    name: "Caderneta",
    url: "/root/passbook",
    icon: BookUser,
    roles: ["ADMIN", "OWNER", "MANAGER", "CASHIER"],
    businessType: "ALL",
  },
  {
    name: "Financeiro",
    url: "/root/financial",
    icon: BadgeDollarSign,
    roles: ["ADMIN", "OWNER", "MANAGER", "CASHIER"],
    businessType: "ALL",
  },
  {
    name: "Fornecedores",
    url: "/root/supplier",
    icon: Truck,
    roles: ["ADMIN", "OWNER", "CASHIER"],
    businessType: "ALL",
  },
  {
    name: "Equipe",
    url: "/root/staff",
    icon: Users,
    roles: ["ADMIN"],
    businessType: "ALL",
  },
];

export const pdvTabs: TabItem[] = [
  { id: "tables", label: "Mesas", businessType: "FOOD_AND_BEVERAGE" },
  { id: "comandas", label: "Comandas", businessType: "FOOD_AND_BEVERAGE" },
  { id: "caixa_rapido", label: "Caixa Rápido", businessType: "ALL" },
];

export const supplierTabs: TabItem[] = [
  { id: "suppliers", label: "Fornecedores", businessType: "ALL" },
];

export const productsTabs: TabItem[] = [
  { id: "products", label: "Produtos Venda", businessType: "ALL" },
  { id: "inventory", label: "Gestão de Estoque", businessType: "ALL" },
  // {
  //   id: "entry-notes",
  //   label: "Entrada de Notas",
  //   businessType: "ALL",
  // },
];

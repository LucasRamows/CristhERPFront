import {
  BadgeDollarSign,
  BookUser,
  LayoutDashboard,
  PackageSearch,
  ShoppingCart,
  Truck,
  Users,
  Utensils,
  type LucideIcon
} from "lucide-react";
import type { User } from "../contexts/DataContext";

export interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
  roles: Array<User["role"]>;
}

export const sidebarNavigation: NavItem[] = [
  {
    name: "Visão Geral",
    url: "/root/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "OWNER", "MANAGER", "CASHIER", "WAITER"],
  },
  {
    name: "Ponto de Venda",
    url: "/root/sales",
    icon: ShoppingCart,
    roles: ["ADMIN", "OWNER", "MANAGER", "CASHIER", "WAITER"],
  },
  {
    name: "Cardápio",
    url: "/root/menu",
    icon: Utensils,
    roles: ["ADMIN", "OWNER", "MANAGER", "CASHIER", "WAITER"],
  },
  {
    name: "Caderneta",
    url: "/root/passbook",
    icon: BookUser,
    roles: ["ADMIN", "OWNER", "MANAGER", "CASHIER", "WAITER"],
  },
  {
    name: "Financeiro",
    url: "/root/financial",
    icon: BadgeDollarSign,
    roles: ["ADMIN", "OWNER"],
  },
  {
    name: "Estoque",
    url: "/root/inventory",
    icon: PackageSearch,
    roles: ["ADMIN", "OWNER", "MANAGER", "CASHIER"],
  },
  {
    name: "Fornecedores",
    url: "/root/supplier",
    icon: Truck,
    roles: ["ADMIN", "OWNER", "CASHIER"],
  },
  {
    name: "Equipe",
    url: "/root/staff",
    icon: Users,
    roles: ["ADMIN", "OWNER"],
  },
];

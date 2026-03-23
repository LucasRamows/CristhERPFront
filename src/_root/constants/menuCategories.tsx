import {
  Coffee,
  Grid,
  IceCream,
  Pizza,
  Plus,
  Scale,
  Utensils,
  Wine,
} from "lucide-react";
import { createElement } from "react";

export const MENU_CATEGORY_NAMES = [
  "Entradas",
  "Principais",
  "Balanca",
  "Sobremesas",
  "Bebidas",
  "Cafés",
  "Adicionais",
] as const;

export type MenuCategoryName = (typeof MENU_CATEGORY_NAMES)[number];

/** Metadados visuais de cada categoria (ícone + cor de badge) */
export const MENU_CATEGORY_META: Record<
  string,
  { icon: React.ReactNode; color: string }
> = {
  Entradas: {
    icon: createElement(Utensils, { size: 18 }),
    color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  },
  Principais: {
    icon: createElement(Pizza, { size: 18 }),
    color: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400",
  },
  Balanca: {
    icon: createElement(Scale, { size: 18 }),
    color: "text-teal-600 bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400",
  },
  Sobremesas: {
    icon: createElement(IceCream, { size: 18 }),
    color: "text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400",
  },
  Bebidas: {
    icon: createElement(Wine, { size: 18 }),
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
  },
  Cafés: {
    icon: createElement(Coffee, { size: 18 }),
    color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400",
  },
  Adicionais: {
    icon: createElement(Plus, { size: 18 }),
    color: "text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400",
  },
};


export const MENU_CATEGORIES_FOR_PDV = [
  { id: "Todos", label: "Todos", icon: createElement(Grid, { size: 18 }) },
  ...MENU_CATEGORY_NAMES.map((name) => ({
    id: name,
    label: name === "Balanca" ? "Balança" : name,
    icon: MENU_CATEGORY_META[name]?.icon ?? createElement(Utensils, { size: 18 }),
  })),
];

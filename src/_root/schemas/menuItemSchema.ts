import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  price: z.number().min(0.01, "Preço deve ser maior que 0"),
  category: z.string().min(1, "Categoria é obrigatória"),
  unit: z.enum(["UN", "KG"]),
  description: z.string(),
  code: z.string(),
  status: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type MenuItemFormType = z.infer<typeof menuItemSchema>;

export interface MenuItem extends MenuItemFormType {
  id: string;
}

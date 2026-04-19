import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  price: z.number().min(0.01, "Preço deve ser maior que 0"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  unit: z.enum(["UN", "KG"]),
  description: z.string().optional(),
  code: z.string().optional(),
  imageUrl: z.string().optional(),
  minStock: z.number().min(0).optional(),
  status: z.boolean(),
  items: z
    .array(
      z.object({
        ingredientId: z.string(),
        quantity: z.number().min(0, "Quantidade deve ser maior ou igual a 0"),
        name: z.string().optional(),
        unit: z.string().optional(),
      }),
    )
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type MenuItemFormType = z.infer<typeof menuItemSchema>;

export interface MenuItem extends MenuItemFormType {
  id: string;
}

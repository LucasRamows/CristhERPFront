import * as z from "zod";

const createSaleSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente."),
  items: z
    .array(
      z.object({
        id: z.any().optional(),
        materialId: z.string(),
        name: z.string(),
        ncm: z.string().optional(),
        grossWeight: z.number(),
        discount: z.number(),
        quantity: z.number(),
        unit: z.string(),
        unitValue: z.number(),
        totalValue: z.number(),
      }),
    )
    .min(1, "Adicione pelo menos um material à nota."),
  freight: z.string().optional(),
  observations: z.string().optional(),
});

export default createSaleSchema;

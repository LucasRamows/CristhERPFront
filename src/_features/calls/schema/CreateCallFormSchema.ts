import * as z from "zod";

const storeCallFormSchema = z.object({
  clientId: z.string().min(1, "Cliente é obrigatório"),
  items: z
    .array(
      z.object({
        materialId: z.string().min(1, "Selecione o material"),
        quantity: z.number().min(0.01, "Qtd mínima 0.01"),
        unit: z.string(),
        price: z.number().min(0, "Preço inválido"),
        subtotal: z.number(),
        // Outros campos fiscais se necessário (NCM, CFOP...)
      }),
    )
    .min(1, "Adicione pelo menos um material à venda"),
  freight: z.number().optional().default(0),
  observations: z.string().optional(),
});

export default storeCallFormSchema
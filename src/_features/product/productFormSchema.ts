import * as z from "zod";

const productSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  type: z.enum(["PRODUCT", "SERVICE", "RAW_MATERIAL"]),
  gender: z.coerce.number(),
  unit: z.enum(["UN", "KG", "L", "M", "M2", "M3", "CX", "PC"]),
  price: z.coerce.string(),
  cost: z.coerce.number().optional(),
  stock: z.coerce.number().default(0),
  minStock: z.coerce.number().optional(),
  ncm: z.string().min(8, "NCM deve ter 8 dígitos"),
  cfop: z.string().min(4, "CFOP inválido"),
  taxOrigin: z.enum(["NATIONAL", "IMPORTED"]),
  icmsCst: z.string(),
  icmsRate: z.coerce.number(),
  ipiCst: z.string().optional(),
  ipiRate: z.coerce.number().optional(),
  pisCst: z.string(),
  pisRate: z.coerce.number(),
  cofinsCst: z.string(),
  cofinsRate: z.coerce.number(),
  cest: z.string().optional(),
});

export default productSchema;

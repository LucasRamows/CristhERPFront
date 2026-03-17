import * as z from "zod";

const employerFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Insira um email válido"),
  role: z.string().min(1, "Selecione ou digite um cargo"),
  phone: z.string().min(10, "Telefone inválido"),
  document: z.string().min(11, "CPF/CNPJ inválido"), // Antigo SKU
});

export default employerFormSchema;

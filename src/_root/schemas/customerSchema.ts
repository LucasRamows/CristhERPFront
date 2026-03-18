import { z } from "zod";

export const customerSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  nickname: z.string().min(2, "Apelido deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone inválido"),
  cpf: z.string().min(14, "CPF/CNPJ inválido"),
  creditLimit: z.number().min(0, "Limite deve ser maior ou igual a zero"),
  settlementDate: z.number().min(1, "Dia inválido").max(31, "Dia inválido"),
});

export type CustomerFormType = z.infer<typeof customerSchema>;

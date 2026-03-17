import { z } from "zod";

export const systemCreateUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["ADMIN", "CLIENT", "MASTER", "USER"]),

  document: z
    .string()
    .min(14, { message: "Informe um CPF ou CNPJ válido" })
    .refine(
      (val) => {
        const clean = val.replace(/\D/g, "");
        return clean.length === 11 || clean.length === 14;
      },
      {
        message: "CPF deve ter 11 dígitos ou CNPJ 14 dígitos",
      },
    ),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  cep: z.string().min(8, { message: "CEP inválido" }),
  city: z.string().min(2, { message: "Cidade inválida" }),
  country: z.string().min(2, { message: "País inválido" }).default("Brasil"),
  uf: z.string().length(2, { message: "UF deve ter 2 letras" }),
  street: z.string().min(3, { message: "Informe a rua" }),
  streetNumber: z.string().min(1, { message: "Informe o número" }),
  neighborhood: z.string().min(2, { message: "Informe o bairro" }),
});

export type SystemUserFormData = z.infer<typeof systemCreateUserSchema>;

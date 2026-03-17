import z from "zod";

const stepOneSchema = z.object({
  responsible: z.string().min(3, "Informe o nome do responsável"),
  phone: z.string().min(10, "Informe um telefone válido"),
  notes: z.string().optional(),
});

export default stepOneSchema
import * as z from "zod";

const createMaterialsForm = z.object({
  name: z
    .string()
    .min(1, { message: "Este campo não pode ficar vazio" })
    .max(50),
  price: z.number().min(1, { message: "Este campo não pode ficar vazio." }),
  class: z.string().min(3, { message: "Este campo não pode ficar vazio." }),
  sku: z.string().min(3, { message: "Este campo não pode ficar vazio." }),
  description: z.string(),
});

export default createMaterialsForm;

import * as z from "zod";
const loginForm = z.object({
  email: z
    .string()
    .min(2, { message: "Este campo não pode ficar vazio" })
    .max(50),
  password: z.string().min(4, { message: "Precisa ter ao menos 4 digitos." }),
});

export default loginForm
import z from "zod";

const addMaterialSchema = z.object({
  materialClass: z.string().min(1, "Selecione o tipo de material."),
  materialName: z.string().min(1, "Informe a descrição ou nome do item."),
  totalWeight: z.string().min(1, "Informe a quantidade estimada."),
  photo: z.custom<File>((val) => val instanceof File, "É obrigatório adicionar uma foto do material."),
});

export {addMaterialSchema}
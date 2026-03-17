// import { zodResolver } from "@hookform/resolvers/zod";
// import { TooltipTrigger } from "@radix-ui/react-tooltip";
// import { Controller, useForm } from "react-hook-form";
// import type z from "zod";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";

// import { Tooltip, TooltipContent } from "../../components/ui/tooltip";
// import { Select } from "../../components/ui/select";
// import productSchema from "../../_features/product/productFormSchema";
// import { formatMoney } from "../../lib/utils";

export default function RootCreateProductForm() {
  // const form = useForm({
  //   resolver: zodResolver(productSchema),
  //   defaultValues: {
  //     name: "",
  //     description: "",
  //     sku: "",
  //     type: "PRODUCT",
  //     gender: 0,
  //     unit: "KG",
  //     price: 0,
  //     cost: 0,
  //     stock: 0,
  //     minStock: 0,
  //     ncm: "",
  //     cfop: "",
  //     taxOrigin: "NATIONAL",
  //     icmsCst: "CST00",
  //     icmsRate: 0,
  //     pisCst: "CST01",
  //     pisRate: 0,
  //     cofinsCst: "CST01",
  //     cofinsRate: 0,
  //   },
  // });

  // const handleSubmit = (values: z.infer<typeof productSchema>) => {
  //   console.log("eira");
  //   console.log(values);
  // };
  // return (
  //   <form
  //     onSubmit={form.handleSubmit(handleSubmit)}
  //     className="flex-1 overflow-y-auto p-6 space-y-6"
  //   >
  //     {/* --- DADOS GERAIS --- */}
  //     <h2 className="font-semibold text-lg border-b pb-2">
  //       Informações Básicas
  //     </h2>

  //     <div className="space-y-1">
  //       <label className="text-xs font-bold uppercase">
  //         Nome do Material / Produto
  //       </label>
  //       <Input {...form.register("name")} placeholder="Ex: Cobre Mel" />
  //       {form.formState.errors.name && (
  //         <p className="text-xs text-red-500">
  //           {form.formState.errors.name.message}
  //         </p>
  //       )}
  //     </div>

  //     <div className="space-y-1">
  //       <label className="text-xs font-bold uppercase">Descrição</label>
  //       <Input
  //         {...form.register("description")}
  //         placeholder="Detalhes opcionais do produto"
  //       />
  //     </div>

  //     <div className="grid grid-cols-2 gap-4">
  //       <div className="space-y-1">
  //         <Tooltip>
  //           <TooltipTrigger asChild>
  //             <label className="text-xs font-bold uppercase">SKU</label>
  //           </TooltipTrigger>
  //           <TooltipContent
  //             side="top"
  //             className="bg-slate-900 text-white border-none shadow-lg"
  //           >
  //             <p className="font-medium text-xs">O codigo único do produto.</p>
  //           </TooltipContent>
  //         </Tooltip>
  //         <Input {...form.register("sku")} placeholder="Código interno" />
  //       </div>
  //       <div className="space-y-1">
  //         <label className="text-xs font-bold uppercase">Unidade</label>
  //         <Controller
  //           control={form.control}
  //           name="unit"
  //           render={({ field }) => (
  //             <select
  //               {...field}
  //               className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
  //             >
  //               <option value="KG">KG</option>
  //               <option value="UN">UN</option>
  //               <option value="L">L</option>
  //               <option value="M3">M3</option>
  //             </select>
  //           )}
  //         />
  //       </div>
  //     </div>

  //     {/* --- COMERCIAL & ESTOQUE --- */}
  //     <h2 className="font-semibold text-lg border-b pb-2 pt-4">
  //       Comercial e Estoque
  //     </h2>

  //     <div className="grid grid-cols-2 gap-4">
  //       <div className="space-y-1">
  //         <label className="text-xs font-bold uppercase">Preço de Venda</label>
  //         <Controller
  //           control={form.control}
  //           name="price"
  //           render={({ field }) => (
  //             <Input
  //               value={formatMoney(field.value as string)}
  //               placeholder="R$ 0,00"
  //               onChange={(e: any) => {
  //                 const numeric =
  //                   Number(e.target.value.replace(/\D/g, "")) / 100;
  //                 field.onChange(numeric);
  //               }}
  //             />
  //           )}
  //         />
  //         {form.formState.errors.price && (
  //           <p className="text-xs text-red-500">
  //             {form.formState.errors.price.message}
  //           </p>
  //         )}
  //       </div>
  //       <div className="space-y-1">
  //         <label className="text-xs font-bold uppercase">Estoque Atual</label>
  //         <Controller
  //           control={form.control}
  //           name="stock"
  //           render={({ field }) => (
  //             <Input
  //               type="number"
  //               {...field}
  //               onChange={(e) => field.onChange(Number(e.target.value))}
  //             />
  //           )}
  //         />
  //       </div>
  //       <div className="space-y-1">
  //         <Tooltip>
  //           <TooltipTrigger asChild>
  //             <span className="text-xs font-bold uppercase cursor-help">
  //               Genero do Produto
  //             </span>
  //           </TooltipTrigger>
  //           <TooltipContent
  //             side="top"
  //             className="bg-slate-900 text-white border-none shadow-lg"
  //           >
  //             <p className="font-medium text-xs">
  //               Classifique a finalidade desse item na empresa.
  //             </p>
  //           </TooltipContent>
  //         </Tooltip>
  //         <Controller
  //           control={form.control}
  //           name="gender"
  //           render={({ field }) => (
  //             <Select
  //               {...field}
  //               className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
  //             >
  //               <option value="00">Mercadoria Para Revenda</option>
  //               <option value="01">Matéria Prima</option>
  //               <option value="02">Embalagem</option>
  //               <option value="03">Produto em Processo</option>
  //               <option value="04">Produto Acabado</option>
  //               <option value="05">Subproduto</option>
  //               <option value="06">Produto Intermediario</option>
  //               <option value="07">Material de Uso e Consumo</option>
  //               <option value="08">Ativo Imobilizado</option>
  //               <option value="09">Serviços</option>
  //               <option value="10">Outros Insumos</option>
  //               <option value="20">Produto Manufaturado</option>
  //               <option value="99">Outros</option>
  //             </Select>
  //           )}
  //         />
  //       </div>
  //       <div className="space-y-1">
  //         <Tooltip>
  //           <TooltipTrigger asChild>
  //             <span className="text-xs font-bold uppercase cursor-help">
  //               Tipo
  //             </span>
  //           </TooltipTrigger>
  //           <TooltipContent
  //             side="top"
  //             className="bg-slate-900 text-white border-none shadow-lg"
  //           >
  //             <p className="font-medium text-xs">
  //               Qual tipo de item cadastrar.
  //             </p>
  //           </TooltipContent>
  //         </Tooltip>
  //         <Controller
  //           control={form.control}
  //           name="type"
  //           render={({ field }) => (
  //             <select
  //               {...field}
  //               className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
  //             >
  //               <option value="PRODUCT">Produto</option>
  //               <option value="SERVICE">Serviços</option>
  //               <option value="RAW_MATERIAL">Resíduos</option>
  //             </select>
  //           )}
  //         />
  //       </div>
  //     </div>

  //     {/* --- FISCAL --- */}
  //     <h2 className="font-semibold text-lg border-b pb-2 pt-4">
  //       Tributação (Fiscal)
  //     </h2>

  //     <div className="grid grid-cols-2 gap-4">
  //       <div className="space-y-1">
  //         <label className="text-xs font-bold uppercase">NCM</label>
  //         <Input {...form.register("ncm")} placeholder="Ex: 39269090" />
  //       </div>
  //       <div className="space-y-1">
  //         <label className="text-xs font-bold uppercase">CFOP</label>
  //         <Input {...form.register("cfop")} placeholder="Ex: 5102" />
  //       </div>
  //     </div>

  //     <div className="space-y-1">
  //       <label className="text-xs font-bold uppercase">
  //         Origem da Mercadoria
  //       </label>
  //       <Controller
  //         control={form.control}
  //         name="taxOrigin"
  //         render={({ field }) => (
  //           <select
  //             {...field}
  //             className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
  //           >
  //             <option value="NATIONAL">Nacional</option>
  //             <option value="IMPORTED">Importado</option>
  //           </select>
  //         )}
  //       />
  //     </div>

  //     <div className="grid grid-cols-2 gap-4">
  //       <div className="space-y-1">
  //         <label className="text-xs font-bold uppercase">CST ICMS</label>
  //         <Controller
  //           control={form.control}
  //           name="icmsCst"
  //           render={({ field }) => (
  //             <select
  //               {...field}
  //               className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
  //             >
  //               <option value="CST00">00 - Tributada</option>
  //               <option value="CST40">40 - Isenta</option>
  //               <option value="CST60">60 - ICMS Pago Ant.</option>
  //             </select>
  //           )}
  //         />
  //       </div>
  //       <div className="space-y-1">
  //         <label className="text-xs font-bold uppercase">
  //           Alíquota ICMS (%)
  //         </label>
  //         <Controller
  //           control={form.control}
  //           name="icmsRate"
  //           render={({ field }) => (
  //             <Input
  //               type="number"
  //               {...field}
  //               onChange={(e) => field.onChange(Number(e.target.value))}
  //             />
  //           )}
  //         />
  //       </div>
  //     </div>

  //     <div className="grid grid-cols-2 gap-4">
  //       <div className="space-y-1">
  //         <label className="text-xs font-bold uppercase">
  //           Alíquota PIS (%)
  //         </label>
  //         <Controller
  //           control={form.control}
  //           name="pisRate"
  //           render={({ field }) => (
  //             <Input
  //               type="number"
  //               {...field}
  //               onChange={(e) => field.onChange(Number(e.target.value))}
  //             />
  //           )}
  //         />
  //       </div>
  //       <div className="space-y-1">
  //         <label className="text-xs font-bold uppercase">
  //           Alíquota COFINS (%)
  //         </label>
  //         <Controller
  //           control={form.control}
  //           name="cofinsRate"
  //           render={({ field }) => (
  //             <Input
  //               type="number"
  //               {...field}
  //               onChange={(e) => field.onChange(Number(e.target.value))}
  //             />
  //           )}
  //         />
  //       </div>
  //     </div>

  //     <Button
  //       type="submit"
  //       className="w-full bg-chart-2 hover:bg-emerald-700 transition-all font-black uppercase py-6 rounded-2xl"
  //     >
  //       Salvar Produto
  //     </Button>
  //   </form>
  // );
  return <div className=""></div>;
}

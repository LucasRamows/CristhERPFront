import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SuccessScreen from "../../../components/shared/SuccessPopUp";
import { formatMoney } from "../../../lib/utils";
import type { MenuItemFormType } from "../../schemas/menuItemSchema";
import { menuItemSchema } from "../../schemas/menuItemSchema";

const defaultCategories = [
  "Entradas",
  "Principais",
  "Sobremesas",
  "Bebidas",
  "Adicionais",
];

export default function RootCreateMenuItemForm({ onSubmit }: any) {
  const [send, setSend] = useState(false);

  const form = useForm<MenuItemFormType>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      description: "",
      code: "",
      status: true,
    },
  });

  const handleSubmit = async (values: MenuItemFormType) => {
    try {
      // Mocking API call
      const newItem = {
        ...values,
        id: Math.random().toString(36).substring(7),
      };

      onSubmit(newItem);

      setSend(true);
      form.reset();
      setTimeout(() => {
        setSend(false);
      }, 3000);
    } catch (err: any) {
      console.error("Erro:", err);
    }
  };

  if (send)
    return (
      <div className="h-full flex justify-center transition-300">
        <SuccessScreen message="Salvo com sucesso!" />
      </div>
    );

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex-1 overflow-y-auto p-6 space-y-6"
    >
      {/* Nome */}
      <Controller
        name="name"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Nome do Item
            </label>
            <input
              {...field}
              placeholder="Ex: Hambúrguer Clássico"
              className="w-full h-14 px-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white dark:focus:bg-zinc-900 focus:border-[#DCFF79] focus:ring-1 focus:ring-[#DCFF79] outline-none transition-all font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 placeholder:font-medium"
            />
            {form.formState.errors.name && (
              <p className="text-[10px] font-bold text-red-500 uppercase mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Preço */}
      <Controller
        name="price"
        control={form.control}
        render={({ field }) => {
          const displayPrice = formatMoney(field.value);
          return (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Preço de Venda
              </label>
              <input
                value={displayPrice}
                onChange={(e) => {
                  const numeric =
                    Number(e.target.value.replace(/\D/g, "")) / 100;
                  field.onChange(numeric);
                }}
                placeholder="R$ 0,00"
                className="w-full h-14 px-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white dark:focus:bg-zinc-900 focus:border-[#DCFF79] focus:ring-1 focus:ring-[#DCFF79] outline-none transition-all font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 placeholder:font-medium"
              />
              {form.formState.errors.price && (
                <p className="text-[10px] font-bold text-red-500 uppercase mt-1">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>
          );
        }}
      />

      {/* Categoria */}
      <Controller
        name="category"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-1.5 relative">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Categoria
            </label>
            <select
              {...field}
              className="w-full h-14 px-5 pr-10 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white dark:focus:bg-zinc-900 focus:border-[#DCFF79] focus:ring-1 focus:ring-[#DCFF79] outline-none appearance-none font-semibold text-zinc-900 dark:text-zinc-100"
            >
              <option value="" disabled hidden>
                Selecione uma categoria...
              </option>
              {defaultCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-[40px] pointer-events-none text-zinc-400"
              size={20}
            />
            {form.formState.errors.category && (
              <p className="text-[10px] font-bold text-red-500 uppercase mt-1">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Código */}
      <Controller
        name="code"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Código / SKU
            </label>
            <input
              {...field}
              placeholder="Ex: HAM-001"
              value={field.value || ""}
              className="w-full h-14 px-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white dark:focus:bg-zinc-900 focus:border-[#DCFF79] focus:ring-1 focus:ring-[#DCFF79] outline-none transition-all font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 placeholder:font-medium"
            />
            {form.formState.errors.code && (
              <p className="text-[10px] font-bold text-red-500 uppercase mt-1">
                {form.formState.errors.code.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Descrição */}
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Descrição
            </label>
            <textarea
              {...field}
              placeholder="Ex: Pão brioche, blend 180g, queijo cheddar..."
              value={field.value || ""}
              className="w-full min-h-[120px] p-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white dark:focus:bg-zinc-900 focus:border-[#DCFF79] focus:ring-1 focus:ring-[#DCFF79] outline-none transition-all font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 placeholder:font-medium resize-none"
            />
            {form.formState.errors.description && (
              <p className="text-[10px] font-bold text-red-500 uppercase mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
        )}
      />

      <div className="pt-6">
        <button
          type="submit"
          className="w-full h-[52px] bg-[#1a1b1e] dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold text-sm tracking-wide hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
        >
          Salvar Item
        </button>
      </div>
    </form>
  );
}

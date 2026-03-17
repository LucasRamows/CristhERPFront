import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SuccessScreen from "../../../components/shared/SuccessPopUp";
import { formatMoney, removeMask } from "../../../lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import type { MenuItemFormType } from "../../forms/schemas/menuItemSchema";
import { menuItemSchema } from "../../forms/schemas/menuItemSchema";
import type { MenuItem } from "../../forms/schemas/menuItemSchema";
import { productsService } from "../../../services/products/products.service";

const defaultCategories = [
  "Entradas",
  "Pratos Principais",
  "Sobremesas",
  "Bebidas",
  "Adicionais",
];

interface EditMenuItemFormProps {
  item: MenuItem;
  onSubmit: (item: MenuItem) => void;
  onDelete: () => void;
}

export default function RootEditMenuItemForm({
  item,
  onSubmit,
  onDelete,
}: EditMenuItemFormProps) {
  const [send, setSend] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MenuItemFormType>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description || "",
      code: item.code || "",
      status: item.status,
    },
  });

  const handleSubmit = async (values: MenuItemFormType) => {
    try {
      setIsLoading(true);
      // Chamada real para a API
      const updatedItem = await productsService.updateProduct(item.id, values);

      onSubmit(updatedItem as MenuItem);

      setSend(true);
      setTimeout(() => {
        setSend(false);
      }, 3000);
    } catch (err: any) {
      console.error("Erro ao atualizar item:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (send)
    return (
      <div className="h-full flex justify-center transition-300">
        <SuccessScreen message="Atualizado com sucesso!" />
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
          const displayPrice = formatMoney(Number(field.value));
          return (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Preço de Venda
              </label>
              <input
                value={displayPrice}
                onChange={(e) => {
                  const numeric = Number(removeMask(e.target.value)) / 100;
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

      {/* Status */}
      <Controller
        name="status"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-2 mt-2 p-5 bg-zinc-50 dark:bg-zinc-900/30 rounded-[24px] border border-zinc-200/50 dark:border-zinc-800/50">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-3">
              Status do Produto
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                  className="w-5 h-5 text-[#DCFF79] border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-[#DCFF79] focus:ring-offset-zinc-50 dark:focus:ring-offset-zinc-950 accent-[#111827] dark:accent-[#DCFF79]"
                />
                <span
                  className={`font-semibold text-sm transition-colors ${
                    field.value === true
                      ? "text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                  }`}
                >
                  Ativo
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                  className="w-5 h-5 text-[#DCFF79] border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-[#DCFF79] focus:ring-offset-zinc-50 dark:focus:ring-offset-zinc-950 accent-[#111827] dark:accent-[#DCFF79]"
                />
                <span
                  className={`font-semibold text-sm transition-colors ${
                    field.value === false
                      ? "text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                  }`}
                >
                  Inativo
                </span>
              </label>
            </div>
          </div>
        )}
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

      {/* Botões */}
      <div className="pt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full sm:w-1/3 h-[52px] bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-500 border border-red-200 dark:border-red-500/20 rounded-full font-bold text-sm tracking-wide hover:bg-red-100 dark:hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Trash2 size={18} /> EXCLUIR
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-2/3 h-[52px] bg-[#1a1b1e] dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold text-sm tracking-wide hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
        </button>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente
              este item do menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 focus:ring-red-600 hover:bg-red-700 text-white rounded-full font-bold tracking-wide"
              disabled={isLoading}
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await productsService.deleteProduct(item.id);
                  onDelete();
                  setShowDeleteConfirm(false);
                } catch (error) {
                  console.error("Erro ao excluir item:", error);
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              {isLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

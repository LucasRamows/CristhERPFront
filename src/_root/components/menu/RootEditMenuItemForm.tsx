import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Package, Plus, ShoppingBasket, Trash2, Weight } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SearhListPicker } from "../../../components/shared/SearhListPicker";
import SuccessScreen from "../../../components/shared/SuccessPopUp";
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
import { formatMoney } from "../../../lib/utils";
import {
  inventoryService,
  type IngredientResponse,
} from "../../../services/inventory/inventory.service";
import { productsService } from "../../../services/products/products.service";
import { MENU_CATEGORY_NAMES } from "../../constants/menuCategories";
import type { MenuItem, MenuItemFormType } from "../../schemas/menuItemSchema";
import { menuItemSchema } from "../../schemas/menuItemSchema";


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
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [ingredientsRepo, setIngredientsRepo] = useState<IngredientResponse[]>([]);

  const form = useForm<MenuItemFormType>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: item.name,
      price: Number(item.price),
      category: item.category,
      unit: (item as any).unit ?? "un",
      description: item.description || "",
      code: item.code || "",
      status: item.status,
      ingredients: (item as any).productRecipes?.map((recipe: any) => ({
        ingredientId: recipe.ingredientId,
        quantity: Number(recipe.quantity),
        name: recipe.ingredient?.name || "",
        unit: recipe.ingredient?.unit || "",
      })) || [],
    },
  });

  const ingredientsField = form.watch("ingredients") || [];

  useEffect(() => {
    const fetchIngs = async () => {
      try {
        const res = await inventoryService.getIngredients();
        setIngredientsRepo(res);
      } catch (err) {
        console.error("Erro ao buscar insumos", err);
      }
    };
    fetchIngs();
  }, []);

  const handleAddIngredient = (ingredient: IngredientResponse) => {
    const exists = ingredientsField.find((i) => i.ingredientId === ingredient.id);
    if (exists) return; // Ja adicionado

    const updated = [
      ...ingredientsField,
      {
        ingredientId: ingredient.id,
        quantity: 0,
        name: ingredient.name,
        unit: ingredient.unit,
      },
    ];
    form.setValue("ingredients", updated);
  };

  const handleRemoveIngredient = (id: string) => {
    const updated = ingredientsField.filter((i) => i.ingredientId !== id);
    form.setValue("ingredients", updated);
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    const updated = ingredientsField.map((i) =>
      i.ingredientId === id ? { ...i, quantity: qty } : i
    );
    form.setValue("ingredients", updated);
  };

  const handleSubmit = async (values: MenuItemFormType) => {
    console.log("Valores do formulário antes de limpar:", values);
    try {
      setIsLoading(true);

      // Criamos um payload seguro, apenas com os campos que devem ser atualizados.
      // E removemos campos como `id`, `restaurantId`, etc, caso estejam presentes no objeto values.
      const payload: any = { ...values };
      delete payload.id;
      delete payload.restaurantId;
      delete payload.restaurant_id;
      delete payload.createdAt;
      delete payload.updatedAt;
      
      payload.price = Number(payload.price);

      const updatedItem = await productsService.updateProduct(item.id, payload);

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
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  const asNumber = Number(onlyDigits) / 100;
                  field.onChange(asNumber);
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

      {/* Unidade de Medida */}
      <Controller
        name="unit"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-4 p-5 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[28px] border border-zinc-200/50 dark:border-zinc-800/50">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                Unidade de Medida
              </label>
              <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                {field.value === "KG" ? "Venda por Peso" : "Venda por Unidade"}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => field.onChange("un")}
                className={`flex-1 h-14 rounded-[20px] text-[11px] font-black transition-all duration-300 flex items-center justify-center gap-3 border-2 ${
                  field.value === "UN"
                    ? "bg-[#DCFF79] border-[#DCFF79] text-zinc-900 shadow-[0_8px_20px_-4px_rgba(220,255,121,0.4)] scale-[1.02]"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <Package size={16} />
                UNIDADE (UN)
              </button>
              <button
                type="button"
                onClick={() => field.onChange("KG")}
                className={`flex-1 h-14 rounded-[20px] text-[11px] font-black transition-all duration-300 flex items-center justify-center gap-3 border-2 ${
                  field.value === "KG"
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-xl scale-[1.02]"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <Weight size={16} />
                PESO (KG)
              </button>
            </div>
          </div>
        )}
      />

      {/* Status */}
      <Controller
        name="status"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-4 p-5 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[28px] border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                Status do Produto
              </label>
              <div
                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                  field.value
                    ? "bg-[#DCFF79]/10 text-[#DCFF79]"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {field.value ? "Disponível no Menu" : "Item Indisponível"}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={isStatusLoading}
                onClick={async () => {
                  if (field.value === true) return;
                  try {
                    setIsStatusLoading(true);
                    await productsService.updateProductStatus(item.id, true);
                    field.onChange(true);
                    toast.success("Produto ativado com sucesso!");
                  } catch (err) {
                    console.error("Erro ao atualizar status:", err);
                    toast.error("Falha ao atualizar o status.");
                  } finally {
                    setIsStatusLoading(false);
                  }
                }}
                className={`flex-1 h-14 rounded-[20px] text-[11px] font-black transition-all duration-300 flex items-center justify-center gap-3 border-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                  field.value === true
                    ? "bg-[#DCFF79] border-[#DCFF79] text-zinc-900 shadow-[0_8px_20px_-4px_rgba(220,255,121,0.4)] scale-[1.02]"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    field.value === true
                      ? "bg-zinc-900 animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.2)]"
                      : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                />
                {isStatusLoading && field.value !== true ? "..." : "ATIVO"}
              </button>
              <button
                type="button"
                disabled={isStatusLoading}
                onClick={async () => {
                  if (field.value === false) return;
                  try {
                    setIsStatusLoading(true);
                    await productsService.updateProductStatus(item.id, false);
                    field.onChange(false);
                    toast.success("Produto desativado.");
                  } catch (err) {
                    console.error("Erro ao atualizar status:", err);
                    toast.error("Falha ao atualizar o status.");
                  } finally {
                    setIsStatusLoading(false);
                  }
                }}
                className={`flex-1 h-14 rounded-[20px] text-[11px] font-black transition-all duration-300 flex items-center justify-center gap-3 border-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                  field.value === false
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-xl scale-[1.02]"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    field.value === false
                      ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                      : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                />
                {isStatusLoading && field.value !== false ? "..." : "INATIVO"}
              </button>
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
              {MENU_CATEGORY_NAMES.map((cat) => (
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

      {/* Ficha Técnica (Insumos) */}
      <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
        <div>
          <h3 className="text-[11px] font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-widest flex items-center gap-2 mb-1">
            <ShoppingBasket size={14} className="text-[#DCFF79]" /> Ficha Técnica / Receita
          </h3>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
            Vincule insumos para baixar estoque na venda
          </p>
        </div>
        
        <div className="relative z-50">
          <SearhListPicker
            items={ingredientsRepo}
            onSelect={(item) => handleAddIngredient(item)}
            placeholder="Buscar insumo por nome..."
            searchKeys={["name"]}
            limit={5}
            renderItem={(item) => (
              <div className="flex items-center gap-3 py-1 text-left">
                <div className="w-8 h-8 flex-shrink-0 bg-[#DCFF79]/10 rounded-xl flex items-center justify-center text-[#DCFF79] group-hover:bg-[#DCFF79] group-hover:text-zinc-900 transition-colors">
                  <Plus size={16} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 truncate">
                    {item.name}
                  </span>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                    {item.unit}
                  </span>
                </div>
              </div>
            )}
          />
        </div>

        <div className="space-y-2 mt-3 relative z-40">
          {ingredientsField.length === 0 ? (
            <div className="p-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Nenhum insumo vinculado
            </div>
          ) : (
            ingredientsField.map((ing) => (
              <div
                key={ing.ingredientId}
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 rounded-2xl gap-3"
              >
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 truncate">
                    {ing.name}
                  </span>
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">
                    {ing.unit}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    value={ing.quantity || ""}
                    onChange={(e) => handleUpdateQuantity(ing.ingredientId, Number(e.target.value))}
                    placeholder="0.00"
                    className="w-20 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2 py-1.5 text-xs font-bold text-center focus:outline-none focus:border-[#DCFF79]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ing.ingredientId)}
                    className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

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

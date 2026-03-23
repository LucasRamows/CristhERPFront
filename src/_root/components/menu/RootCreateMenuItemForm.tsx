import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SearhListPicker } from "../../../components/shared/SearhListPicker";
import SuccessScreen from "../../../components/shared/SuccessPopUp";
import { formatMoney } from "../../../lib/utils";
import {
  inventoryService,
  type IngredientResponse,
} from "../../../services/inventory/inventory.service";
import { productsService } from "../../../services/products/products.service";
import { MENU_CATEGORY_NAMES } from "../../constants/menuCategories";
import type { MenuItemFormType } from "../../schemas/menuItemSchema";
import { menuItemSchema } from "../../schemas/menuItemSchema";

export default function RootCreateMenuItemForm({ onSubmit }: any) {
  const [send, setSend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ingredientsRepo, setIngredientsRepo] = useState<IngredientResponse[]>([]);

  const form = useForm<MenuItemFormType>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      unit: "UN",
      description: "",
      code: "",
      status: true,
      ingredients: [],
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
    try {
      setIsLoading(true);
      // O backend já está preparado para receber `ingredients` no DTO caso as validações match.
      const newItem = await productsService.createProduct(values);
      onSubmit(newItem);
      setSend(true);
      form.reset();
      setTimeout(() => {
        setSend(false);
      }, 3000);
    } catch (err: any) {
      console.error("Erro:", err);
    } finally {
      setIsLoading(false);
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
      className="flex-1 flex flex-col pt-2"
    >
      <div className="space-y-6 flex-1 pr-1 pb-20">
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

        {/* Categoria e Unidade Flex */}
        <div className="grid grid-cols-2 gap-4">
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
                    Categorias..
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

          <Controller
            name="code"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Código (SKU)
                </label>
                <input
                  {...field}
                  placeholder="EX-01"
                  value={field.value || ""}
                  className="w-full h-14 px-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white dark:focus:bg-zinc-900 focus:border-[#DCFF79] focus:ring-1 focus:ring-[#DCFF79] outline-none transition-all font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 placeholder:font-medium"
                />
              </div>
            )}
          />
        </div>

        {/* Ficha Técnica (Insumos) */}
        <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
          <div>
            <h3 className="text-[11px] font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-widest flex items-center gap-2 mb-1">
              <ShoppingBasket size={14} className="text-primary" /> Ficha Técnica / Receita
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
                  <div className="w-8 h-8 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-zinc-900 transition-colors">
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
                      className="w-20 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2 py-1.5 text-xs font-bold text-center focus:outline-none focus:border-primary"
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
            <div className="space-y-1.5 pt-4">
              <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Descrição
              </label>
              <textarea
                {...field}
                placeholder="Ex: Pão brioche, blend 180g, receita secreta..."
                value={field.value || ""}
                className="w-full min-h-[100px] p-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white dark:focus:bg-zinc-900 focus:border-[#DCFF79] focus:ring-1 focus:ring-[#DCFF79] outline-none transition-all font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 placeholder:font-medium resize-none"
              />
            </div>
          )}
        />
      </div>

      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0 sticky bottom-0 bg-white z-50">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[52px] bg-[#1a1b1e] dark:bg-white text-white dark:text-zinc-900 rounded-full font-black text-sm tracking-widest uppercase hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "SALVANDO..." : "Salvar Item e Ficha"}
        </button>
      </div>
    </form>
  );
}

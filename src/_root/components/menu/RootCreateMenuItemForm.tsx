import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  Package,
  Plus,
  ShoppingBasket,
  Trash2,
  Weight,
  Info,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SearhListPicker } from "../../../components/shared/SearhListPicker";
import SuccessScreen from "../../../components/shared/SuccessPopUp";
import { formatMoney, cn } from "../../../lib/utils";
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
  const [ingredientsRepo, setIngredientsRepo] = useState<IngredientResponse[]>(
    [],
  );
  const [activeTab, setActiveTab] = useState<"info" | "recipe">("info");

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
    const exists = ingredientsField.find(
      (i) => i.ingredientId === ingredient.id,
    );
    if (exists) return;

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
      i.ingredientId === id ? { ...i, quantity: qty } : i,
    );
    form.setValue("ingredients", updated);
  };

  const handleSubmit = async (values: MenuItemFormType) => {
    try {
      setIsLoading(true);
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

  const cardClasses =
    "space-y-4 p-6 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[32px] border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm";
  const labelHeaderClasses =
    "text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.15em] mb-1.5 block";
  const inputBaseClasses =
    "w-full h-14 px-5 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-[20px] focus:border-decoration focus:ring-1 focus:ring-decoration outline-none transition-all font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 placeholder:font-medium";

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tab Switcher */}
      <div className="flex p-1.5 mx-6 mb-6 bg-zinc-100 dark:bg-zinc-900 rounded-[24px] border border-zinc-200/50 dark:border-zinc-800/50 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={cn(
            "flex-1 h-12 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
            activeTab === "info"
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm scale-[1.02]"
              : "text-zinc-400 hover:text-zinc-500",
          )}
        >
          <Info size={16} />
          Informações
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("recipe")}
          className={cn(
            "flex-1 h-12 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
            activeTab === "recipe"
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm scale-[1.02]"
              : "text-zinc-400 hover:text-zinc-500",
          )}
        >
          <FileText size={16} />
          Ficha Técnica
        </button>
      </div>

      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-8 custom-scrollbar">
          {activeTab === "info" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Seção 1: Identificação */}
              <div className={cardClasses}>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className={labelHeaderClasses}>Nome do Item</label>
                      <input
                        {...field}
                        placeholder="Ex: Hambúrguer Clássico"
                        className={inputBaseClasses}
                      />
                      {form.formState.errors.name && (
                        <p className="text-[10px] font-bold text-red-500 uppercase mt-1 pl-1">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className={labelHeaderClasses}>Descrição</label>
                      <textarea
                        {...field}
                        placeholder="Ex: Pão brioche, blend 180g, receita secreta..."
                        value={field.value || ""}
                        className={cn(
                          inputBaseClasses,
                          "min-h-[120px] p-5 resize-none",
                        )}
                      />
                    </div>
                  )}
                />
              </div>

              {/* Seção 2: Valores e Categorias */}
              <div className={cardClasses}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="price"
                    control={form.control}
                    render={({ field }) => {
                      const displayPrice = formatMoney(field.value);
                      return (
                        <div className="space-y-2">
                          <label className={labelHeaderClasses}>
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
                            className={inputBaseClasses}
                          />
                          {form.formState.errors.price && (
                            <p className="text-[10px] font-bold text-red-500 uppercase mt-1 pl-1">
                              {form.formState.errors.price.message}
                            </p>
                          )}
                        </div>
                      );
                    }}
                  />

                  <Controller
                    name="category"
                    control={form.control}
                    render={({ field }) => (
                      <div className="space-y-2 relative">
                        <label className={labelHeaderClasses}>Categoria</label>
                        <select
                          {...field}
                          className={cn(
                            inputBaseClasses,
                            "appearance-none pr-10",
                          )}
                        >
                          <option value="" disabled hidden>
                            Selecione...
                          </option>
                          {MENU_CATEGORY_NAMES.map((cat) => (
                            <option key={cat}>{cat}</option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-4 top-[46px] pointer-events-none text-zinc-400"
                          size={20}
                        />
                        {form.formState.errors.category && (
                          <p className="text-[10px] font-bold text-red-500 uppercase mt-1 pl-1">
                            {form.formState.errors.category.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <Controller
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className={labelHeaderClasses}>Código (SKU)</label>
                      <input
                        {...field}
                        placeholder="EX-01"
                        value={field.value || ""}
                        className={inputBaseClasses}
                      />
                    </div>
                  )}
                />
              </div>

              {/* Seção 3: Unidade de Medida */}
              <Controller
                name="unit"
                control={form.control}
                render={({ field }) => (
                  <div className={cardClasses}>
                    <div className="flex items-center justify-between">
                      <label className={labelHeaderClasses}>
                        Forma de Venda
                      </label>
                      <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                        {field.value === "KG"
                          ? "Preço por Quilo"
                          : "Preço por Unidade"}
                      </div>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => field.onChange("UN")}
                        className={`flex-1 h-16 rounded-[24px] text-[11px] font-black transition-all duration-300 flex items-center justify-center gap-3 border-2 ${
                          field.value === "UN"
                            ? "bg-decoration border-decoration text-zinc-900 shadow-lg scale-[1.02]"
                            : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300"
                        }`}
                      >
                        <Package size={20} />
                        UNIDADE
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange("KG")}
                        className={`flex-1 h-16 rounded-[24px] text-[11px] font-black transition-all duration-300 flex items-center justify-center gap-3 border-2 ${
                          field.value === "KG"
                            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-lg scale-[1.02]"
                            : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300"
                        }`}
                      >
                        <Weight size={20} />
                        PESO (KG)
                      </button>
                    </div>
                  </div>
                )}
              />
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
              {/* Seção 4: Ficha Técnica */}
              <div className={cardClasses}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-decoration/10 rounded-2xl flex items-center justify-center text-decoration">
                    <ShoppingBasket size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-zinc-800 dark:text-zinc-100 uppercase tracking-tighter">
                      Ficha Técnica
                    </h3>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Controle de Saída de Estoque
                    </p>
                  </div>
                </div>

                <div className="relative z-50 mt-6">
                  <SearhListPicker
                    items={ingredientsRepo}
                    onSelect={(item) => handleAddIngredient(item)}
                    placeholder="Buscar insumo para adicionar..."
                    searchKeys={["name"]}
                    limit={5}
                    renderItem={(item) => (
                      <div className="flex items-center gap-4 py-1">
                        <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400">
                          <Plus size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-zinc-800">
                            {item.name}
                          </span>
                          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                            {item.unit}
                          </span>
                        </div>
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-3 mt-6">
                  {ingredientsField.length === 0 ? (
                    <div className="py-20 border-2 border-dashed border-zinc-100 dark:border-zinc-800/50 rounded-[32px] flex flex-col items-center justify-center text-center px-6">
                      <ShoppingBasket
                        size={48}
                        className="text-zinc-200 mb-4 opacity-50"
                      />
                      <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                        Sem insumos vinculados
                      </p>
                    </div>
                  ) : (
                    ingredientsField.map((ing) => (
                      <div
                        key={ing.ingredientId}
                        className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[24px] group hover:border-decoration/40 transition-all"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
                            {ing.name}
                          </span>
                          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                            {ing.unit}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <input
                              type="number"
                              value={ing.quantity || ""}
                              onChange={(e) =>
                                handleUpdateQuantity(
                                  ing.ingredientId,
                                  Number(e.target.value),
                                )
                              }
                              placeholder="0.00"
                              className="w-24 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[16px] px-3 py-2 text-sm font-black text-center focus:outline-none focus:border-decoration"
                            />
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 bg-white dark:bg-zinc-900 text-[8px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-widest">
                              Qtd
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveIngredient(ing.ingredientId)
                            }
                            className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md absolute bottom-0 left-0 right-0 z-100">
          <button

            type="submit"
            disabled={isLoading}
            className="w-full h-16 bg-[#1a1b1e] dark:bg-white text-white dark:text-zinc-900 rounded-[28px] font-black text-xs tracking-[0.2em] uppercase hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white animate-spin rounded-full" />
            ) : (
              <>
                <Plus
                  size={18}
                  className="group-hover:rotate-90 transition-transform"
                />
                Salvar Menu e Ficha
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

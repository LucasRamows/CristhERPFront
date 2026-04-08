import {
  ChevronDown,
  FileText,
  Info,
  Package,
  Plus,
  ShoppingBasket,
  Trash2,
  Weight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { SearhListPicker } from "../../../components/shared/SearhListPicker";
import SuccessScreen from "../../../components/shared/SuccessPopUp";
import { BrInput } from "../../../components/ui/BrInput";
import { Sheet, SheetContent } from "../../../components/ui/sheet";
import {
  inventoryService,
  type IngredientResponse,
} from "../../../services/inventory/inventory.service";
import { productsService } from "../../../services/products/products.service";
import type { MenuItemFormType } from "../../schemas/menuItemSchema";
import { menuItemSchema } from "../../schemas/menuItemSchema";
import { useAuthenticatedUser } from "../../../contexts/DataContext";

interface CreateMenuItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newItem: any) => void;
}

export function CreateMenuItemSheet({
  open,
  onOpenChange,
  onSuccess,
}: CreateMenuItemSheetProps) {
  const { data: user } = useAuthenticatedUser();
  const [send, setSend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ingredientsRepo, setIngredientsRepo] = useState<IngredientResponse[]>(
    [],
  );

  const form = useForm<MenuItemFormType>({
    defaultValues: {
      name: "",
      price: 0,
      categoryId: "",
      unit: "UN",
      description: "",
      code: "",
      status: true,
      ingredients: [],
    },
  });

  const ingredientsField = form.watch("ingredients") || [];

  useEffect(() => {
    if (!open) {
      form.reset();
      setSend(false);
    } else {
      fetchIngs();
    }
  }, [open, form]);

  const fetchIngs = async () => {
    try {
      const res = await inventoryService.getIngredients();
      setIngredientsRepo(res);
    } catch (err) {
      console.error("Erro ao buscar insumos", err);
    }
  };

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
    const result = menuItemSchema.safeParse(values);
    if (!result.success) {
      const firstError =
        result.error.issues[0]?.message || "Verifique os campos.";
      toast.error(firstError);
      return;
    }

    try {
      setIsLoading(true);
      const newItem = await productsService.createProduct(result.data as any);
      toast.success("Produto criado!");
      setSend(true);
      setTimeout(() => {
        onSuccess(newItem);
        onOpenChange(false);
      }, 1500);
    } catch (err: any) {
      console.error("Erro:", err);
      toast.error("Erro ao criar produto.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-[500px] p-0 flex flex-col bg-background outline-none"
      >
        {send ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <SuccessScreen message="Produto criado com sucesso!" />
          </div>
        ) : (
          <>
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto px-6 pt-10 pb-32 space-y-10 custom-scrollbar">
              {/* Header inside scroll so it moves with content */}
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase">
                  Novo Produto
                </h2>
                <p className="text-sm font-medium text-muted-foreground pl-1">
                  Preencha os dados básicos e a composição do item.
                </p>
              </div>

              {/* Seção: Informações Básicas */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Info size={16} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Informações Básicas
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Nome do Item
                    </label>
                    <input
                      {...form.register("name")}
                      placeholder="Ex: Hambúrguer Artesanal"
                      className="w-full h-14 px-5 bg-muted/30 border border-border rounded-2xl focus:bg-background focus:border-primary outline-none transition-all font-bold text-sm"
                    />
                    {form.formState.errors.name && (
                      <p className="text-[10px] font-bold text-destructive pl-1 uppercase">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Preço de Venda
                    </label>
                    <Controller
                      name="price"
                      control={form.control}
                      render={({ field }) => (
                        <BrInput
                          prefix="R$"
                          decimals={2}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Categoria
                    </label>
                    <div className="relative">
                      <select
                        {...form.register("categoryId")}
                        className="w-full h-14 px-5 border border-border rounded-2xl outline-none appearance-none font-bold text-sm bg-transparent"
                      >
                        <option value="">Selecione...</option>
                        {user?.restaurant?.ProductCategories?.map(
                          (cat: any) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ),
                        )}
                      </select>
                      <ChevronDown
                        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                        size={18}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Unidade
                    </label>
                    <div className="flex gap-2 p-1 bg-muted/30 rounded-2xl border border-border">
                      <button
                        type="button"
                        onClick={() => form.setValue("unit", "UN")}
                        className={`flex-1 h-12 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 ${
                          form.watch("unit") === "UN"
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Package size={14} /> UNIDADE
                      </button>
                      <button
                        type="button"
                        onClick={() => form.setValue("unit", "KG")}
                        className={`flex-1 h-12 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 ${
                          form.watch("unit") === "KG"
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Weight size={14} /> PESO (KG)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção: Ficha Técnica */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <FileText size={16} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Composição / Insumos
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="relative z-50">
                    <SearhListPicker
                      items={ingredientsRepo}
                      onSelect={handleAddIngredient}
                      placeholder="Adicionar insumo à composição..."
                      searchKeys={["name"]}
                      limit={5}
                      renderItem={(item) => (
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center text-primary">
                            <Plus size={16} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-xs">
                              {item.name}
                            </span>
                            <span className="text-[9px] font-black text-muted-foreground uppercase">
                              {item.unit}
                            </span>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <div className="space-y-2 relative z-40">
                    {ingredientsField.length === 0 ? (
                      <div className="p-10 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center opacity-40">
                        <ShoppingBasket size={32} className="mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-widest">
                          Sem insumos vinculados
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {ingredientsField.map((ing) => (
                          <div
                            key={ing.ingredientId}
                            className="flex items-center gap-3 p-3 bg-card border border-border rounded-2xl"
                          >
                            <div className="flex-1">
                              <p className="font-bold text-xs truncate">
                                {ing.name}
                              </p>
                              <p className="text-[9px] font-black text-muted-foreground uppercase">
                                {ing.unit}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <BrInput
                                value={ing.quantity}
                                onChange={(val) =>
                                  handleUpdateQuantity(ing.ingredientId, val)
                                }
                                placeholder="0.000"
                                decimals={3}
                                className="w-24 h-10 bg-background border border-border rounded-xl px-2 text-center"
                                inputClassName="bg-transparent border-none text-center w-full font-bold text-xs"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveIngredient(ing.ingredientId)
                                }
                                className="w-10 h-10 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Seção: Extras */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Plus size={16} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Descrição e Código
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Código / SKU
                    </label>
                    <input
                      {...form.register("code")}
                      placeholder="Ex: HAM001"
                      className="w-full h-14 px-5 bg-muted/30 border border-border rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Descrição
                    </label>
                    <textarea
                      {...form.register("description")}
                      placeholder="Detalhes sobre o produto..."
                      className="w-full min-h-[120px] p-5 bg-muted/30 border border-border rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-8 border-t border-border bg-background/80 backdrop-blur-md absolute bottom-0 left-0 right-0 z-50">
              <button
                type="button"
                disabled={isLoading}
                onClick={form.handleSubmit(handleSubmit)}
                className="w-full h-16 bg-primary text-primary-foreground rounded-2xl font-black text-xs tracking-[0.2em] uppercase hover:shadow-xl hover:scale-[1.01] active:scale-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-current border-t-transparent animate-spin rounded-full" />
                ) : (
                  <>
                    <Plus size={20} strokeWidth={3} />
                    CRIAR NOVO PRODUTO
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

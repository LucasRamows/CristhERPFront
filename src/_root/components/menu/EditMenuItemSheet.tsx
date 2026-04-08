import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronDown,
  Edit2,
  FileText,
  Info,
  Loader2,
  Package,
  Plus,
  ShoppingBasket,
  Trash2,
  Weight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
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
import { BrInput } from "../../../components/ui/BrInput";
import { Sheet, SheetContent, SheetTitle } from "../../../components/ui/sheet";
import { useAuthenticatedUser } from "../../../contexts/DataContext";
import {
  inventoryService,
  type IngredientResponse,
} from "../../../services/inventory/inventory.service";
import {
  productsService,
  type ProductsResponse,
  type ProductsStatsResponse,
} from "../../../services/products/products.service";
import type { MenuItem, MenuItemFormType } from "../../schemas/menuItemSchema";
import { menuItemSchema } from "../../schemas/menuItemSchema";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EditMenuItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ProductsResponse | null;
  onEditSubmit: (item: MenuItem) => void;
  onDelete: () => void;
}

type View = "options" | "edit";

// ─── Options View ─────────────────────────────────────────────────────────────

function OptionsView({
  item,
  onEditClick,
  onDeleteClick,
}: {
  item: ProductsResponse;
  onEditClick: () => void;
  onDeleteClick: () => void;
}) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [salesData, setSalesData] = useState<ProductsStatsResponse[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const stats = await productsService.getProductStats(item.id);
        const formattedData = stats.map((s) => ({
          ...s,
          sales_date: format(new Date(s.sales_date), "dd/MM", { locale: ptBR }),
          total: Number(s.quantity),
        }));
        setSalesData(formattedData);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, [item.id]);

  const handleToggleStatus = async () => {
    try {
      setIsUpdatingStatus(true);
      const newStatus = !item.status;
      await productsService.updateProduct(item.id, { status: newStatus });
      item.status = newStatus;
      toast.success(`Produto ${newStatus ? "ativado" : "pausado"} com sucesso`);
    } catch {
      toast.error("Erro ao atualizar status do produto");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
        <div>
          <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">
            {item.category?.name || "Sem Categoria"}
          </p>
          <h2 className="text-2xl font-black leading-tight">{item.name}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-8">
        {/* Gráfico de Vendas */}
        <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Desempenho Mensal
              </p>
              <h4 className="text-lg font-black text-zinc-800">
                Vendas do Item
              </h4>
            </div>
            {!isLoadingStats && (
              <div className="bg-decoration px-3 py-1 rounded-full text-[10px] font-black text-zinc-900 uppercase">
                Em Tempo Real
              </div>
            )}
          </div>

          <div className="h-[120px] w-full flex items-center justify-center">
            {isLoadingStats ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase">
                  Calculando dados...
                </span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DCFF79" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#DCFF79" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="sales_date" hide />
                  <Tooltip
                    labelStyle={{ color: "#94a3b8" }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      fontSize: "12px",
                      fontWeight: "800",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="quantity"
                    stroke="#DCFF79"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-5 rounded-[24px] border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
              Preço Atual
            </p>
            <p className="text-xl font-black text-gray-900">
              R$ {Number(item.price).toFixed(2)}
            </p>
          </div>
          <button
            disabled={isUpdatingStatus}
            onClick={handleToggleStatus}
            className="bg-gray-50 p-5 rounded-[24px] border border-gray-100 flex flex-col justify-center text-left hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
              Status (Clique p/ alternar)
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  item.status
                    ? "bg-[#DCFF79] shadow-[0_0_10px_#DCFF79]"
                    : "bg-gray-300"
                }`}
              />
              <p className="text-base font-bold text-gray-900">
                {isUpdatingStatus ? "..." : item.status ? "Ativo" : "Pausado"}
              </p>
            </div>
          </button>
        </div>

        {/* Ações */}
        <div className="space-y-3">
          <button
            onClick={onEditClick}
            className="w-full flex items-center p-5 bg-white border border-gray-100 rounded-[24px] hover:border-gray-200 hover:bg-gray-50 transition-all group"
          >
            <div className="bg-gray-100 p-3 rounded-2xl group-hover:bg-[#DCFF79] transition-colors mr-4">
              <Edit2
                size={20}
                className="group-hover:text-zinc-900 transition-colors"
              />
            </div>
            <div className="text-left">
              <h4 className="font-black text-gray-800 leading-tight">
                Editar Dados
              </h4>
              <p className="text-[11px] text-gray-500 font-medium uppercase tracking-tight">
                Nome, preço, categoria e descrição
              </p>
            </div>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center p-5 bg-red-50/30 border border-red-100 rounded-[24px] hover:bg-red-50 transition-all group"
          >
            <div className="bg-red-100 p-3 rounded-2xl text-red-600 mr-4">
              <Trash2 size={20} />
            </div>
            <div className="text-left">
              <h4 className="font-black text-red-600 leading-tight">
                Excluir Permanente
              </h4>
              <p className="text-[11px] text-red-400 font-medium uppercase tracking-tight">
                Remover permanentemente do sistema
              </p>
            </div>
          </button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="rounded-[32px] border-none p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black">
              Você tem certeza?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-500 font-medium">
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              produto{" "}
              <span className="font-bold text-zinc-900">{item.name}</span> do
              seu cardápio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-full font-bold border-zinc-200">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white rounded-full font-bold px-8 shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center"
              disabled={isDeleting}
              onClick={async (e) => {
                e.preventDefault();
                try {
                  setIsDeleting(true);
                  await productsService.deleteProduct(item.id);
                  onDeleteClick();
                } catch {
                  toast.error("Erro ao excluir o produto.");
                  setIsDeleting(false);
                }
              }}
            >
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Edit View ────────────────────────────────────────────────────────────────

function EditView({
  item,
  onSubmit,
  onBack,
}: {
  item: ProductsResponse;
  onSubmit: (item: MenuItem) => void;
  onBack: () => void;
}) {
  const { data: user } = useAuthenticatedUser();
  const [send, setSend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ingredientsRepo, setIngredientsRepo] = useState<IngredientResponse[]>(
    [],
  );

  const form = useForm<MenuItemFormType>({
    defaultValues: {
      name: item.name || "",
      price: Number(item.price),
      categoryId: item.categoryId || (item as any).category?.id || "",
      unit: ((item as any).unit || "UN").toUpperCase() as "UN" | "KG",
      description: item.description || "",
      code: item.code || "",
      status: item.status,
      ingredients:
        (item as any).productRecipes?.map((recipe: any) => ({
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
    if (ingredientsField.find((i) => i.ingredientId === ingredient.id)) return;
    form.setValue("ingredients", [
      ...ingredientsField,
      {
        ingredientId: ingredient.id,
        quantity: 0,
        name: ingredient.name,
        unit: ingredient.unit,
      },
    ]);
  };

  const handleRemoveIngredient = (id: string) => {
    form.setValue(
      "ingredients",
      ingredientsField.filter((i) => i.ingredientId !== id),
    );
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    form.setValue(
      "ingredients",
      ingredientsField.map((i) =>
        i.ingredientId === id ? { ...i, quantity: qty } : i,
      ),
    );
  };

  const handleSubmit = async (values: MenuItemFormType) => {
    const result = menuItemSchema.safeParse(values);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message || "Erro de validação.");
      return;
    }
    try {
      setIsLoading(true);
      const updatedItem = await productsService.updateProduct(
        item.id,
        result.data as any,
      );
      onSubmit(updatedItem as MenuItem);
      setSend(true);
      setTimeout(() => setSend(false), 3000);
    } catch {
      toast.error("Não foi possível salvar as alterações.");
    } finally {
      setIsLoading(false);
    }
  };

  if (send) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <SuccessScreen message="Atualizado com sucesso!" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
        <div>
          <button
            onClick={onBack}
            className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1 hover:text-gray-600 transition-colors flex items-center gap-1"
          >
            ← Voltar
          </button>
          <h2 className="text-2xl font-black leading-tight">Editar Item</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-32 space-y-10 custom-scrollbar">
        {/* Informações Básicas */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <Info size={16} className="text-gray-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Informações Básicas
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Nome do Item
              </label>
              <input
                {...form.register("name")}
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-400 outline-none transition-all font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Código / SKU
                </label>
                <input
                  {...form.register("code")}
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-400 outline-none transition-all font-bold text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Categoria
                </label>
                <div className="relative">
                  <select
                    {...form.register("categoryId")}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none font-bold text-sm"
                  >
                    <option value="">Nenhuma</option>
                    {user?.restaurant?.ProductCategories?.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Unidade
              </label>
              <Controller
                name="unit"
                control={form.control}
                render={({ field }) => (
                  <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => field.onChange("UN")}
                      className={`flex-1 h-10 rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-2 ${
                        field.value?.toUpperCase() === "UN"
                          ? "bg-white shadow-sm text-gray-900 border border-gray-100"
                          : "text-gray-400"
                      }`}
                    >
                      <Package size={13} /> UNIDADE
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("KG")}
                      className={`flex-1 h-10 rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-2 ${
                        field.value === "KG"
                          ? "bg-white shadow-sm text-gray-900 border border-gray-100"
                          : "text-gray-400"
                      }`}
                    >
                      <Weight size={13} /> PESO (KG)
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        {/* Composição / Insumos */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <FileText size={16} className="text-gray-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Composição / Insumos
            </span>
          </div>

          <div className="space-y-4">
            <div className="relative z-50">
              <SearhListPicker
                items={ingredientsRepo}
                onSelect={handleAddIngredient}
                placeholder="Adicionar insumo..."
                searchKeys={["name"]}
                limit={5}
                renderItem={(ing) => (
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                      <Plus size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs">{ing.name}</span>
                      <span className="text-[9px] font-black text-gray-400 uppercase">
                        {ing.unit}
                      </span>
                    </div>
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              {ingredientsField.length === 0 ? (
                <div className="p-10 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBasket size={32} className="mb-2 text-gray-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Receita vazia
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {ingredientsField.map((ing) => (
                    <div
                      key={ing.ingredientId}
                      className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-2xl"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-xs truncate">{ing.name}</p>
                        <p className="text-[9px] font-black text-gray-400 uppercase">
                          {ing.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <BrInput
                          value={ing.quantity}
                          onChange={(val) =>
                            handleUpdateQuantity(ing.ingredientId, val)
                          }
                          decimals={3}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveIngredient(ing.ingredientId)
                          }
                          className="w-9 h-9 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
            Descrição
          </label>
          <textarea
            {...form.register("description")}
            rows={3}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-400 outline-none transition-all font-bold text-sm resize-none"
          />
        </div>
      </div>

      {/* Footer fixo */}
      <div className="p-4 md:p-6 border-t border-gray-100 bg-white absolute bottom-0 left-0 right-0 flex gap-3 shrink-0">
        <button
          type="button"
          disabled={isLoading}
          onClick={form.handleSubmit(handleSubmit)}
          className="flex-1 h-12 bg-gray-900 text-white rounded-xl font-black text-xs tracking-widest uppercase hover:bg-gray-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Salvar Alterações"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main Sheet ───────────────────────────────────────────────────────────────

export function EditMenuItemSheet({
  open,
  onOpenChange,
  item,
  onEditSubmit,
  onDelete,
}: EditMenuItemSheetProps) {
  const [view, setView] = useState<View>("options");

  // Reset view ao fechar/abrir
  useEffect(() => {
    if (open) setView("options");
  }, [open, item?.id]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-[500px] p-0 flex flex-col h-full bg-white border-l border-gray-100 outline-none"
      >
        {item && (
          <>
            <SheetTitle className="sr-only">Gerenciar {item.name}</SheetTitle>

            {view === "options" ? (
              <OptionsView
                item={item}
                onEditClick={() => setView("edit")}
                onDeleteClick={onDelete}
              />
            ) : (
              <EditView
                item={item}
                onSubmit={onEditSubmit}
                onBack={() => setView("options")}
              />
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default EditMenuItemSheet;

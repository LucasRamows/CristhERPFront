import { Droplet, Package, RefreshCw, Weight, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BrInput } from "../../../../components/ui/BrInput";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../../components/ui/sheet";
import { Switch } from "../../../../components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import { useAuthenticatedUser } from "../../../../contexts/DataContext";
import { getReference } from "../../../../lib/utils";
import {
  type ItemResponse
} from "../../../../services/inventory/inventory.service";
import { useInventoryContext } from "../../hooks/InventoryContext";

interface CreateItemSheetProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: (item: ItemResponse) => void;
  activeItem?: ItemResponse | null;
}

export function CreateItemSheet({
  isOpen: isOpenProp,
  onClose: onCloseProp,
  onSuccess: onSuccessProp,
  activeItem: activeItemProp,
}: CreateItemSheetProps) {
  const context = useInventoryContext();

  const isOpen = isOpenProp ?? context?.isCreateInventoryOpen ?? false;
  const onClose =
    onCloseProp ?? (() => context?.setIsCreateInventoryOpen?.(false));
  const onSuccess = onSuccessProp ?? context?.handleCreateInventorySuccess;
  const activeItem = activeItemProp ?? context?.selectedInventoryItem ?? null;

  if (!onClose) {
    throw new Error(
      "CreateItemSheet requires onClose prop or InventoryProvider context",
    );
  }

  if (!onSuccess) {
    throw new Error(
      "CreateItemSheet requires onSuccess prop or InventoryProvider context",
    );
  }
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [unit, setUnit] = useState("UN");
  const [minStock, setMinStock] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para criação simultânea de produto
  const [createAsProduct, setCreateAsProduct] = useState(false);
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState("");

  const { categories } = useAuthenticatedUser();

  useEffect(() => {
    if (activeItem) {
      setName(activeItem.name);
      setCode(activeItem.code || "");
      setUnit(activeItem.unit);
      setMinStock(activeItem.minStock);
    } else {
      setName("");
      setCode("");
      setUnit("UN");
      setMinStock(0);
    }
  }, [activeItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      setIsLoading(true);

      await context.handleSaveInventoryItem(
        {
          name,
          code: code || null,
          unit,
          minStock: Number(minStock),
          createProduct: createAsProduct,
          price: createAsProduct ? price : undefined,
          categoryId: createAsProduct ? categoryId : undefined,
          description: createAsProduct
            ? `Produto criado automaticamente a partir do insumo ${name}`
            : undefined,
        },
        activeItem?.id
      );
    } catch (err) {
      // O erro já é tratado no context (toast)
    } finally {
      setIsLoading(false);
    }
  };

  const isEdit = !!activeItem?.id;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-112.5 p-0 flex flex-col h-full bg-background border-l border-border outline-none [&>button]:hidden text-left"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{isEdit ? "Editar Insumo" : "Novo Insumo"}</SheetTitle>
        </SheetHeader>

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-border flex items-center justify-between bg-muted/50 shrink-0">
          <div>
            <p className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] mb-1">
              Estoque • Insumos
            </p>
            <h2 className="text-2xl font-black text-foreground">
              {isEdit ? "Editar Insumo" : "Novo Insumo"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-sm border border-border hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative"
        >
          {/* Toggle de Criar como Produto */}
          {!isEdit && (
            <div className="flex items-center justify-between p-5 bg-primary/5 border border-primary/20 rounded-[28px] transition-all">
              <div className="space-y-0.5">
                <p className="text-sm font-black text-foreground uppercase tracking-tight">
                  Criar também como Produto
                </p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  O item será cadastrado no estoque e na lista de vendas
                </p>
              </div>
              <Switch
                checked={createAsProduct}
                onCheckedChange={setCreateAsProduct}
              />
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Nome da Matéria-Prima
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Alface Americana"
                className="w-full h-14 px-5 bg-muted/50 border border-border rounded-xl focus:bg-background focus:border-primary outline-none transition-all font-semibold"
              />
            </div>

            {createAsProduct && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Preço de Venda
                  </label>
                  <BrInput
                    prefix="R$"
                    decimals={2}
                    value={price}
                    onChange={(v) => setPrice(v)}
                    className="flex items-center h-14 bg-muted/50 border border-border rounded-xl px-5 focus-within:bg-background focus-within:border-primary transition-all overflow-hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Categoria
                  </label>
                  <div className="relative">
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full h-14 px-5 bg-muted/50 border border-border rounded-xl focus:bg-background focus:border-primary outline-none transition-all font-semibold appearance-none"
                    >
                      <option value="">Selecione</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {/* Ícone de chevron para o select customizado */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L6 6L11 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Código de Referência
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex: REF-12345"
                  disabled={isEdit}
                  className={`w-full h-14 px-5 pr-12 bg-muted/50 border border-border rounded-xl focus:bg-background focus:border-primary outline-none transition-all font-semibold ${
                    isEdit ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                />
                {!isEdit && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setCode(getReference())}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-muted text-muted-foreground transition"
                      >
                        <RefreshCw size={18} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Gerar Referência</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              {isEdit ? (
                <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wide px-2">
                  O código de referência não pode ser alterado após a criação,
                  apenas se for no produto.
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Unidade de Medida
              </label>
              <div className="flex gap-2 p-1 bg-muted/50 border border-border rounded-xl">
                <button
                  type="button"
                  onClick={() => setUnit("UN")}
                  className={`flex-1 flex items-center justify-center h-11 rounded-xl text-sm font-medium transition-all ${
                    unit === "UN"
                      ? "bg-background shadow border border-border text-foreground"
                      : "text-muted-foreground hover:bg-muted text-foreground/80"
                  }`}
                >
                  <Package size={16} className="inline mr-1.5" />
                  Unidade
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("KG")}
                  className={`flex-1 flex items-center justify-center h-11 rounded-xl text-sm font-medium transition-all ${
                    unit === "KG"
                      ? "bg-background shadow border border-border text-foreground"
                      : "text-muted-foreground hover:bg-muted text-foreground/80"
                  }`}
                >
                  <Weight size={16} className="inline mr-1.5" />
                  Kg
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("L")}
                  className={`flex-1 flex items-center justify-center h-11 rounded-xl text-sm font-medium transition-all ${
                    unit === "L"
                      ? "bg-background shadow border border-border text-foreground"
                      : "text-muted-foreground hover:bg-muted text-foreground/80"
                  }`}
                >
                  <Droplet size={16} className="inline mr-1.5" />
                  Litro
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Estoque Mínimo
              </label>
              <input
                type="number"
                value={minStock || ""}
                onChange={(e) => setMinStock(Number(e.target.value))}
                placeholder="Ex: 5"
                className="w-full h-14 px-5 bg-muted/50 border border-border rounded-xl focus:bg-background focus:border-primary outline-none transition-all font-semibold"
              />
              <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wide px-2">
                O sistema avisará quando o estoque atingir este valor.
              </p>
            </div>
          </div>

          <div className="pt-8 mt-auto sticky bottom-0 bg-background pb-8">
            <button
              type="submit"
              disabled={isLoading || !name}
              className="w-full h-15 bg-foreground text-background rounded-[24px] font-black text-sm tracking-widest uppercase hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0 shadow-xl"
            >
              {isLoading
                ? "Salvando..."
                : isEdit
                ? "Salvar Alterações"
                : "Criar Insumo"}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

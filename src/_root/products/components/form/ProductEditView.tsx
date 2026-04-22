import {
  ChevronDown,
  ChevronLeft,
  Info,
  Loader2,
  Package,
  Weight,
} from "lucide-react";
import { Controller } from "react-hook-form";

import { UniversalImageUploader } from "../../../../components/shared/UniversalmageUploader";
import { BrInput } from "../../../../components/ui/BrInput";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useAuthenticatedUser } from "../../../../contexts/DataContext";
import { useInventoryContext } from "../../hooks/new/InventoryContext";
import { useProductForm } from "../../hooks/new/useEditForm";
import { CompositionSection } from "../shared/CompositionSection";

interface ProductEditViewProps {
  onBack?: () => void;
}

export default function ProductEditView({ onBack }: ProductEditViewProps) {
  const { categories } = useAuthenticatedUser();
  const { isRetail } = useInventoryContext();

  const {
    form,
    itemsField,
    imageUrl,
    itemsRepo,
    isLoading,
    handleSubmit,
    addIngredient,
    removeIngredient,
    updateQuantity,
  } = useProductForm();

  // Monitoramos os dois toggles
  const isSimpleProduct = form.watch("isSimpleProduct") ?? false;
  const manageStock = form.watch("manageStock") ?? true; // No varejo, o padrão é controlar o estoque

  // Regra de exibição do Estoque Mínimo
  const showMinStock =
    (isRetail && manageStock) || (!isRetail && isSimpleProduct);

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-gray-100 flex items-center gap-4 bg-gray-50 shrink-0">
        {onBack && (
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h2 className="text-2xl font-black leading-tight">Editar Item</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32 space-y-10 custom-scrollbar">
        {/* Imagem do Produto */}
        <UniversalImageUploader
          value={imageUrl}
          onUploadComplete={(url) => form.setValue("imageUrl", url)}
          onRemove={() => form.setValue("imageUrl", "")}
          label="Imagem do Produto"
          maxSizeMB={5}
        />

        {/* Informações Básicas */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <Info size={16} className="text-gray-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Informações Básicas
            </span>
          </div>

          <div className="space-y-4">
            {/* Nome */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Nome do Item
              </label>
              <input
                {...form.register("name")}
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-400 outline-none transition-all font-bold text-sm"
              />
            </div>

            {/* Preço e Estoque Mínimo Dinâmico */}
            <div
              className={`grid gap-3 ${
                showMinStock ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
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
                      className="flex items-center w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-gray-400 transition-all"
                      inputClassName="flex-1 bg-transparent border-none font-bold text-sm text-gray-900 outline-none w-full"
                    />
                  )}
                />
              </div>

              {/* O Estoque Mínimo aparece nas duas situações onde faz sentido */}
              {showMinStock && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Estoque Mínimo
                  </label>
                  <Controller
                    name="minStock"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-400 outline-none transition-all font-bold text-sm"
                        type="number"
                        value={field.value ?? ""}
                        onChange={(event) => {
                          const value = (event.target as HTMLInputElement)
                            .value;
                          field.onChange(
                            value === "" ? undefined : Number(value),
                          );
                        }}
                      />
                    )}
                  />
                </div>
              )}
            </div>

            {/* Código e Categoria */}
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
                    {categories.map((cat) => (
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

            {/* Unidade */}
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
        {/* Só aparece se for Restaurante E for Produto Composto */}
        {!isRetail && !isSimpleProduct && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <CompositionSection
              items={itemsField}
              itemsRepo={itemsRepo}
              onAddItem={addIngredient}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeIngredient}
              title="Receita / Insumos"
              placeholder="Adicionar insumo à receita..."
            />
          </div>
        )}

        {/* Descrição */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
            Descrição
          </label>
          <textarea
            {...form.register("description")}
            rows={3}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-gray-400 outline-none transition-all font-bold text-sm resize-none"
            placeholder="Detalhes sobre o produto..."
          />
        </div>
      </div>

      {/* Footer Fixo */}
      <div className="p-4 md:p-6 border-t border-gray-100 bg-white absolute bottom-0 left-0 right-0 flex gap-3 shrink-0 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <Button
          disabled={isLoading}
          onClick={form.handleSubmit(handleSubmit)}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </div>
    </div>
  );
}

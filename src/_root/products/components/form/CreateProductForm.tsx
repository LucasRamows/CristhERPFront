"use client";

import {
  ChevronLeft,
  Info,
  Package,
  RefreshCw,
  Weight,
  Layers,
  Box,
  Archive,
  ArchiveX,
  Loader2,
} from "lucide-react";
import { Controller } from "react-hook-form";
import { useAuthenticatedUser } from "../../../../contexts/DataContext";
import { UniversalImageUploader } from "../../../../components/shared/UniversalmageUploader";
import { BrInput } from "../../../../components/ui/BrInput";
import { Input } from "../../../../components/ui/input";
import { Switch } from "../../../../components/ui/switch";
import { CompositionSection } from "../shared/CompositionSection";
import { getReference } from "../../../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";

import { useInventoryContext } from "../../hooks/new/InventoryContext";
import { useProductForm } from "../../hooks/new/useEditForm";
import { Button } from "../../../../components/ui/button";

interface CreateProductFormProps {
  onCancel: () => void;
  onSuccessClose: () => void;
}

export function CreateProductForm({
  onCancel,
  onSuccessClose,
}: CreateProductFormProps) {
  const { categories } = useAuthenticatedUser();
  const { isRetail } = useInventoryContext();

  const {
    form,
    itemsField,
    itemsRepo,
    isLoading,
    handleSubmit,
    addIngredient,
    updateQuantity,
    removeIngredient,
  } = useProductForm({ onSuccessClose });

  const isSimpleProduct = form.watch("isSimpleProduct") ?? false;
  const manageStock = form.watch("manageStock") ?? true;

  const showMinStock =
    (isRetail && manageStock) || (!isRetail && isSimpleProduct);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b flex items-center gap-4 bg-gray-50 shrink-0">
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-black">Novo Produto</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
        {/* Imagem do Produto */}
        <UniversalImageUploader
          value={form.watch("imageUrl")}
          onUploadComplete={(url) => form.setValue("imageUrl", url)}
          onRemove={() => form.setValue("imageUrl", "")}
          label="Imagem do Produto"
          maxSizeMB={5}
        />

        {/* Informações Básicas */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <Info size={16} className="text-gray-400" />
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">
              INFORMAÇÕES BÁSICAS
            </span>
          </div>

          <div className="space-y-5">
            {/* Nome */}
            <div className="space-y-1.5">
              <label className="text-sm text-gray-600 mb-1 block">
                Nome do Item
              </label>
              <input
                {...form.register("name")}
                className="w-full h-12 px-5 border border-gray-200 rounded-xl focus:border-primary outline-none font-medium"
                placeholder="Ex: Hambúrguer Artesanal"
              />
            </div>

            {/* TOGGLES DINÂMICOS (VAREJO VS RESTAURANTE) */}
            {isRetail ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      manageStock
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {manageStock ? (
                      <Archive size={18} />
                    ) : (
                      <ArchiveX size={18} />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-gray-900 leading-none">
                      Controlar Estoque
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {manageStock
                        ? "Gera item de inventário automático."
                        : "Produto avulso/serviço. Não deduz do estoque."}
                    </p>
                  </div>
                </div>
                <Controller
                  name="manageStock"
                  control={form.control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isSimpleProduct
                        ? "bg-blue-100 text-blue-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {isSimpleProduct ? <Box size={18} /> : <Layers size={18} />}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-gray-900 leading-none">
                      Controle Individual (Produto Simples)
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {isSimpleProduct
                        ? "Este produto tem seu próprio estoque direto."
                        : "O estoque depende dos insumos (Receita)."}
                    </p>
                  </div>
                </div>
                <Controller
                  name="isSimpleProduct"
                  control={form.control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            )}

            {/* Preço e Estoque Mínimo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm text-gray-600 mb-1 block">
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
                      className="flex items-center w-full h-12 px-5 border border-gray-200 rounded-xl focus-within:border-primary transition-all"
                    />
                  )}
                />
              </div>

              {showMinStock && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                  <label className="text-sm text-gray-600 mb-1 block">
                    Estoque Mínimo
                  </label>
                  <Controller
                    name="minStock"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        className="w-full h-12 px-5 pr-12 border border-gray-200 rounded-xl focus:border-primary outline-none font-mono"
                        value={field.value || ""}
                        onChange={(event) => {
                          const value = (event.target as HTMLInputElement)
                            .value;
                          field.onChange(
                            value === "" ? undefined : Number(value),
                          );
                        }}
                        placeholder="0"
                      />
                    )}
                  />
                </div>
              )}
            </div>

            {/* Código + Categoria */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm text-gray-600 mb-1 block">
                  Referência / SKU
                </label>

                <div className="relative">
                  <input
                    {...form.register("code")}
                    className="w-full h-12 px-5 pr-12 border border-gray-200 rounded-xl focus:border-primary outline-none font-mono"
                    placeholder="HAM001"
                  />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => form.setValue("code", getReference())}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition"
                      >
                        <RefreshCw size={18} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Gerar Referência</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-gray-600 mb-1 block">
                  Categoria
                </label>
                <div className="relative">
                  <select
                    {...form.register("categoryId")}
                    className="w-full h-12 px-5 border border-gray-200 rounded-xl outline-none appearance-none font-medium"
                  >
                    <option value="">Selecione</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Unidade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm text-gray-600 mb-1 block">
                  Unidade
                </label>
                <Controller
                  name="unit"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex gap-2 p-1 bg-gray-50 border border-gray-200 rounded-xl">
                      <button
                        type="button"
                        onClick={() => field.onChange("UN")}
                        className={`flex-1 h-11 rounded-xl text-sm font-medium transition-all ${
                          field.value === "UN"
                            ? "bg-white shadow border border-gray-300 text-gray-900"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        <Package size={16} className="inline mr-1.5" />
                        Unidade
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange("KG")}
                        className={`flex-1 h-11 rounded-xl text-sm font-medium transition-all ${
                          field.value === "KG"
                            ? "bg-white shadow border border-gray-300 text-gray-900"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        <Weight size={16} className="inline mr-1.5" />
                        Kg
                      </button>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Composição / Insumos - Apenas para F&B com receita composta */}
        {!isRetail && !isSimpleProduct && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <CompositionSection
              items={itemsField}
              itemsRepo={itemsRepo}
              onAddItem={addIngredient}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeIngredient}
              title="Composição / Insumos"
              placeholder="Adicionar insumo à receita..."
            />
          </div>
        )}

        {/* Descrição */}
        <div className="space-y-1.5">
          <label className="text-sm text-gray-600 mb-1 block">Descrição</label>
          <textarea
            {...form.register("description")}
            rows={4}
            className="w-full p-5 border border-gray-200 rounded-xl focus:border-primary outline-none resize-none font-medium"
            placeholder="Descreva o produto, características, ingredientes..."
          />
        </div>
      </div>

      {/* Footer Fixo */}
      <div className="p-6 border-t border-gray-100 bg-white">
        <Button
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Criando Produto...
            </>
          ) : (
            "Criar Novo Produto"
          )}
        </Button>
      </div>
    </div>
  );
}

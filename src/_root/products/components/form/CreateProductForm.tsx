"use client";

import { ChevronLeft, Info, Package, RefreshCw, Weight } from "lucide-react";
import { Controller } from "react-hook-form";
import { useAuthenticatedUser } from "../../../../contexts/DataContext";
import { useCreateProductForm } from "../../hooks/useCreateProductForm";
import { UniversalImageUploader } from "../../../../_features/storage/UniversalmageUploader";
import { BrInput } from "../../../../components/ui/BrInput";
import { Input } from "../../../../components/ui/input";
import { CompositionSection } from "../shared/CompositionSection";
import LoadingComponent from "../../../../components/shared/LoadingComponent";
import type { CreateProductFormProps } from "../../types/product.types";
import { getReference } from "../../../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";

export function CreateProductForm({
  isRetail,
  onCancel,
}: CreateProductFormProps) {
  const { categories } = useAuthenticatedUser();

  const {
    form,
    itemsField,
    itemsRepo,
    isLoading,
    handleSubmit,
    addIngredient,
    updateQuantity,
    removeIngredient,
  } = useCreateProductForm();

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

            {/* Preço */}
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
                  />
                )}
              />
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

            {/* Unidade + Estoque Mínimo (apenas Retail) */}
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

              {isRetail && (
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-600 mb-1 block">
                    Estoque Mínimo
                  </label>
                  <Controller
                    name="minStock"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        value={field.value || ""}
                        onChange={(event) => {
                          const value = (event.target as HTMLInputElement)
                            .value;
                          field.onChange(
                            value === "" ? undefined : Number(value),
                          );
                        }}
                        placeholder="0"
                        className="h-12"
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Composição / Insumos - Apenas para produtos não Retail */}
        {!isRetail && (
          <CompositionSection
            ingredients={itemsField}
            itemsRepo={itemsRepo}
            onAddIngredient={addIngredient}
            onUpdateQuantity={updateQuantity}
            onRemoveIngredient={removeIngredient}
            title="Composição / Insumos"
            placeholder="Adicionar insumo à receita..."
          />
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
        <button
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isLoading}
          className="w-full h-14 bg-black hover:bg-zinc-900 text-white rounded-xl font-semibold text-base transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading ? <LoadingComponent /> : "Criar Novo Produto"}
        </button>
      </div>
    </div>
  );
}

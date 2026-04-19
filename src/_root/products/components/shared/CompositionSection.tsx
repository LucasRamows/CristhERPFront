"use client";

import { FileText, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { SearchListPicker } from "../../../../components/shared/SearchListPicker";
import { BrInput } from "../../../../components/ui/BrInput";

interface CompositionItem {
  ingredientId: string;
  name?: string;
  unit?: string;
  quantity: number | string;
}

interface CompositionSectionProps {
  ingredients: CompositionItem[];
  itemsRepo: any[];
  onAddIngredient: (item: any) => void;
  onUpdateQuantity: (ingredientId: string, quantity: number) => void;
  onRemoveIngredient: (ingredientId: string) => void;
  title?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function CompositionSection({
  ingredients,
  itemsRepo,
  onAddIngredient,
  onUpdateQuantity,
  onRemoveIngredient,
  title = "Composição / Insumos",
  placeholder = "Adicionar insumo à composição...",
  disabled = false,
}: CompositionSectionProps) {
  return (
    <div className="space-y-6">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <FileText size={16} className="text-primary" />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {title}
        </span>
      </div>

      <div className="space-y-4">
        {/* Buscador de Insumos */}
        <div>
          <SearchListPicker
            items={itemsRepo}
            onSelect={onAddIngredient}
            placeholder={placeholder}
            searchKeys={["name"]}
            limit={5}
            renderItem={(item: any) => (
              <div className="flex items-center gap-3 py-1">
                <div className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center text-primary">
                  <Plus size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs">{item.name}</span>
                  <span className="text-[9px] font-black text-muted-foreground uppercase">
                    {item.unit}
                  </span>
                </div>
              </div>
            )}
          />
        </div>

        {/* Lista de Insumos Adicionados */}
        <div className="space-y-2">
          {ingredients.length === 0 ? (
            <div className="p-10 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center opacity-40">
              <ShoppingBasket size={32} className="mb-2" />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Sem insumos vinculados
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {ingredients.map((ing) => (
                <div
                  key={ing.ingredientId}
                  className="flex items-center gap-3 p-3 bg-card border border-border rounded-2xl"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs truncate">
                      {ing.name || "Insumo sem nome"}
                    </p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase">
                      {ing.unit || "UN"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <BrInput
                      value={Number(ing.quantity)}
                      onChange={(val: number) =>
                        onUpdateQuantity(ing.ingredientId, val)
                      }
                      placeholder="0.000"
                      decimals={3}
                      className="w-24 h-10 bg-background border border-border rounded-xl px-2 text-center"
                      inputClassName="bg-transparent border-none text-center w-full font-bold text-xs"
                      disabled={disabled}
                    />

                    <button
                      type="button"
                      onClick={() => onRemoveIngredient(ing.ingredientId)}
                      disabled={disabled}
                      className="w-10 h-10 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded-xl transition-all active:scale-95"
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
  );
}

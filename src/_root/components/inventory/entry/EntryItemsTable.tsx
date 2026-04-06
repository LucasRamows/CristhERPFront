import { Package, ShoppingCart, Trash2 } from "lucide-react";
import { formatMoney } from "../../../../lib/utils";
import { BrInput } from "../../../../components/ui/BrInput";
import { InventoryQuantityInput } from "../InventoryQuantityInput";

export interface EntryItem {
  ingredientId: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

interface Props {
  items: EntryItem[];
  total: number;
  updateItem: (id: string, updates: Partial<EntryItem>) => void;
  removeItem: (id: string) => void;
}

export function EntryItemsTable({
  items,
  total,
  updateItem,
  removeItem,
}: Props) {
  return (
    <div className="flex-1 bg-card border border-border rounded-[28px] overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="font-black text-sm text-foreground flex items-center gap-2">
          <ShoppingCart size={16} className="text-primary" />
          Itens da Nota
        </h2>
        <span className="px-2.5 py-1 bg-muted rounded-full text-[10px] font-black text-muted-foreground uppercase">
          {items.length} {items.length === 1 ? "item" : "itens"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        {items.length === 0 ? (
          <div className="h-full min-h-[200px] flex flex-col items-center justify-center gap-3 text-muted-foreground p-8">
            <Package size={40} className="opacity-10" />
            <div className="text-center">
              <p className="font-bold text-sm">Nenhum item adicionado</p>
              <p className="text-xs opacity-60 mt-1">
                Use o campo de busca para adicionar insumos
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="w-full hidden sm:table">
              <thead className="bg-muted text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">
                <tr>
                  <th className="px-5 py-3.5 text-left">Insumo</th>
                  <th className="px-4 py-3.5 text-center w-32">Qtd.</th>
                  <th className="px-4 py-3.5 text-center w-40">Preço Unit.</th>
                  <th className="px-4 py-3.5 text-center w-32">Subtotal</th>
                  <th className="px-5 py-3.5 w-14"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {items.map((item) => (
                  <tr
                    key={item.ingredientId}
                    className="group hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-foreground text-sm">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                          {item.unit}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <InventoryQuantityInput
                        unit={item.unit}
                        value={item.quantity}
                        onChange={(num) =>
                          updateItem(item.ingredientId, { quantity: num })
                        }
                      />
                    </td>
                    <td className="px-4 py-4">
                      <BrInput
                        prefix="R$"
                        decimals={2}
                        value={item.unitPrice}
                        onChange={(num) =>
                          updateItem(item.ingredientId, { unitPrice: num })
                        }
                      />
                    </td>
                    <td className="px-4 py-4 text-center font-black text-sm text-foreground">
                      {formatMoney(item.quantity * item.unitPrice)}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => removeItem(item.ingredientId)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-all active:scale-95"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-border/50">
              {items.map((item) => (
                <div key={item.ingredientId} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        {item.name}
                      </p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                        {item.unit}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.ingredientId)}
                      className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">
                        Quantidade
                      </p>
                      <InventoryQuantityInput
                        unit={item.unit}
                        value={item.quantity}
                        onChange={(num) =>
                          updateItem(item.ingredientId, { quantity: num })
                        }
                        inputClassName="w-full h-9 bg-muted border border-border rounded-xl text-center font-black text-sm outline-none"
                      />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">
                        Preço Unit.
                      </p>
                      <div className="flex items-center h-9 bg-muted border border-border rounded-xl px-2.5">
                        <span className="text-xs font-bold text-muted-foreground mr-1">
                          R$
                        </span>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={item.unitPrice || ""}
                          onChange={(e) =>
                            updateItem(item.ingredientId, {
                              unitPrice:
                                e.target.value === ""
                                  ? 0
                                  : Number(e.target.value),
                            })
                          }
                          placeholder="0,00"
                          className="flex-1 bg-transparent border-none font-bold text-foreground text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-xs font-black text-foreground">
                      {formatMoney(item.quantity * item.unitPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer total */}
      {items.length > 0 && (
        <div className="px-5 py-4 bg-foreground text-background flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-50">
              Total da Nota
            </p>
            <p className="text-2xl font-black leading-none">
              {formatMoney(total)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-50">
              Itens
            </p>
            <p className="text-xl font-black leading-none">{items.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}

import { Plus, Trash2 } from "lucide-react";
import { SearchListPicker } from "../../../../components/shared/SearchListPicker";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";

import { useEntryNote } from "../../hooks/EntryNoteContext";   // ← Novo hook

export function ItemsSection() {
  const {
    form: { items },
    availableItems,
    addItem,
    updateItem,
    removeItem,
    openCreateItemSheet,
  } = useEntryNote();

  const subtotal = items.reduce(
    (acc: number, item: any) =>
      acc + (Number(item.quantidade) || 0) * (Number(item.valorUnitario) || 0),
    0
  );

  return (
    <Card className="rounded-xl shadow-sm border bg-card overflow-hidden">
      <CardHeader className="pb-6 pt-6 space-y-5 bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-black tracking-tighter">
              Produtos e Serviços
            </CardTitle>
            {items.length > 0 && (
              <Badge variant="secondary" className="font-mono text-xs">
                {items.length} itens
              </Badge>
            )}
          </div>

          <Button
            onClick={openCreateItemSheet}
            size="sm"
            className="rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Novo Item
          </Button>
        </div>

        {/* Busca de itens disponíveis */}
        <div>
          <SearchListPicker
            items={availableItems}
            placeholder="Buscar item no estoque ou produto..."
            searchKeys={["name", "code"]}
            onSelect={(item: any) => {
              addItem({
                nome: item.name || item.nome || "",
                codigoProduto: item.code || item.id || "",
                quantidade: 1,
                valorUnitario: Number(item.precoCusto || item.unitPrice || 0),
                unidade: item.unidade || "UN",
              });
            }}
            renderItem={(item: any) => (
              <div className="flex flex-col py-1.5">
                <span className="font-semibold text-sm">
                  {item.name || item.nome}
                </span>
                <span className="text-xs text-muted-foreground">
                  Estoque: {item.currentStock || 0} | 
                  {item.unidade || "UN"}
                </span>
              </div>
            )}
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 sticky top-0 z-10">
              <tr className="border-b">
                <th className="px-6 py-4 text-left font-medium text-muted-foreground tracking-tight">
                  Produto / Serviço
                </th>
                <th className="px-6 py-4 text-center font-medium text-muted-foreground tracking-tight w-28">
                  Quantidade
                </th>
                <th className="px-6 py-4 text-center font-medium text-muted-foreground tracking-tight w-40">
                  Valor Unitário
                </th>
                <th className="px-6 py-4 text-center font-medium text-muted-foreground tracking-tight w-40">
                  Total
                </th>
                <th className="px-6 py-4 w-16" />
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {items.map((item: any, index: number) => (
                <tr
                  key={item.id || index}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Input
                      value={item.nome || ""}
                      placeholder="Descrição do produto ou serviço"
                      className="border-0 bg-transparent shadow-none font-medium focus-visible:ring-1 focus-visible:ring-ring/30 h-9 px-1"
                      onChange={(e) =>
                        updateItem(index, { nome: e.target.value })
                      }
                    />
                  </td>

                  <td className="px-6 py-4">
                    <Input
                      type="number"
                      step="0.001"
                      min="0"
                      value={item.quantidade || ""}
                      className="text-center font-semibold border border-border/60 focus:border-primary h-9"
                      onChange={(e) =>
                        updateItem(index, {
                          quantidade: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </td>

                  <td className="px-6 py-4">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        R$
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.valorUnitario || ""}
                        className="pl-8 text-center font-semibold text-emerald-600 dark:text-emerald-400 border border-border/60 focus:border-primary h-9"
                        onChange={(e) =>
                          updateItem(index, {
                            valorUnitario: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center font-black text-lg tracking-tight text-foreground">
                    R$ {(Number(item.quantidade) * Number(item.valorUnitario) || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl opacity-60 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6">
                        <Plus className="w-8 h-8 text-muted-foreground/40" />
                      </div>
                      <p className="font-semibold text-lg text-muted-foreground mb-1">
                        Nenhum item adicionado
                      </p>
                      <p className="text-sm text-muted-foreground max-w-xs">
                        Utilize a busca acima para adicionar produtos do estoque
                        ou clique em "Criar Novo Item".
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

            {/* Subtotal */}
            {items.length > 0 && (
              <tfoot>
                <tr className="border-t border-border bg-muted/40">
                  <td
                    colSpan={3}
                    className="px-6 py-5 text-right font-medium text-muted-foreground"
                  >
                    Subtotal
                  </td>
                  <td className="px-6 py-5 text-center font-black text-xl tracking-tighter">
                    R$ {subtotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-5" />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
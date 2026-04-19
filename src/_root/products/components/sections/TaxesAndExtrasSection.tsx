import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";

import { useEntryNote } from "../../hooks/EntryNoteContext";

export function TaxesAndExtrasSection() {
  const { form, totals, patch } = useEntryNote();

  return (
    <Card className="rounded-xl shadow-sm border-border bg-card">
      <CardHeader className="pb-3 pt-4 bg-muted/20 border-b border-border rounded-t-xl">
        <CardTitle className="text-lg font-black uppercase tracking-tighter text-muted-foreground">
          Outros Valores da Nota Fiscal
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {/* LINHA 1 */}
        <div className="space-y-1">
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Base Cálculo ICM Substituto
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={totals?.baseIcmsSt || 0}
            onChange={(e) =>
              patch({ 
                icmsRetido: parseFloat(e.target.value) || 0   // Estamos usando icmsRetido como proxy por enquanto
              })
            }
            placeholder="0,00"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Valor ICM Substituto (ST)
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={totals?.valorIcmsSt || form.icmsRetido || 0}
            onChange={(e) =>
              patch({ 
                icmsRetido: parseFloat(e.target.value) || 0 
              })
            }
            placeholder="0,00"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            ICMS Retido
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.icmsRetido || 0}
            onChange={(e) =>
              patch({ icmsRetido: parseFloat(e.target.value) || 0 })
            }
            placeholder="0,00"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Descontos (-)
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.descontos || 0}
            onChange={(e) =>
              patch({ descontos: parseFloat(e.target.value) || 0 })
            }
            placeholder="0,00"
          />
        </div>

        {/* LINHA 2 */}
        <div className="space-y-1">
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Valor do Frete (+)
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.frete || 0}
            onChange={(e) => patch({ frete: parseFloat(e.target.value) || 0 })}
            placeholder="0,00"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Valor do Seguro (+)
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.seguro || 0}
            onChange={(e) => patch({ seguro: parseFloat(e.target.value) || 0 })}
            placeholder="0,00"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Outras Despesas (+)
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.outrasDespesas || 0}
            onChange={(e) =>
              patch({ outrasDespesas: parseFloat(e.target.value) || 0 })
            }
            placeholder="0,00"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            Valor do IPI
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={totals?.valorIpi || 0}
            onChange={() =>
              patch({ /* valorIpi é calculado automaticamente */ })
            }
            disabled
            className="bg-muted/50"
            placeholder="0,00"
          />
        </div>
      </CardContent>
    </Card>
  );
}
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";

import { useEntryNote } from "../../hooks/EntryNoteContext";   // ← Novo hook correto

export function IcmsSection() {
  const { form, patch } = useEntryNote();

  const icmsRows = form.icmsRows;

  const updateRow = (index: number, field: "alicota" | "base" | "valor", value: number) => {
    const newRows = [...icmsRows];
    newRows[index] = { ...newRows[index], [field]: value };

    patch({ icmsRows: newRows });
  };

  return (
    <Card className="rounded-xl shadow-sm border-border bg-card">
      <CardHeader className="pb-3 pt-4 bg-muted/20 border-b border-border rounded-t-xl">
        <CardTitle className="text-lg font-black uppercase tracking-tighter text-muted-foreground">
          Dados do ICMS
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-[30px_1fr_1fr_1fr] gap-4 items-end">
          {/* Header */}
          <div></div>
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">
            Alíquota (%)
          </Label>
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">
            Base de Cálculo
          </Label>
          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">
            Valor do ICMS
          </Label>

          {/* Linhas */}
          {icmsRows.map((row: any, idx: number) => (
            <React.Fragment key={idx}>
              <div className="text-xs font-bold text-muted-foreground pb-3 pt-1">
                ({idx + 1}):
              </div>

              <Input
                type="number"
                step="0.01"
                min="0"
                value={row.alicota || ""}
                onChange={(e) =>
                  updateRow(idx, "alicota", parseFloat(e.target.value) || 0)
                }
                className="text-center"
                placeholder="0,00"
              />

              <Input
                type="number"
                step="0.01"
                min="0"
                value={row.base || ""}
                onChange={(e) =>
                  updateRow(idx, "base", parseFloat(e.target.value) || 0)
                }
                className="text-center"
                placeholder="0,00"
              />

              <Input
                type="number"
                step="0.01"
                min="0"
                value={row.valor || ""}
                onChange={(e) =>
                  updateRow(idx, "valor", parseFloat(e.target.value) || 0)
                }
                className="text-center"
                placeholder="0,00"
              />
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
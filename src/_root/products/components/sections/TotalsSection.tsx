import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

import { useEntryNote } from "../../hooks/EntryNoteContext";

function format(value?: number | null) {
  if (value === null || value === undefined) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function TotalsSection() {
  const { totals } = useEntryNote();

  return (
    <Card className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-6 pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-black tracking-tighter">
            Totais da Nota
          </CardTitle>
          {/* Badge removido temporariamente pois importedFields não existe ainda */}
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pb-8">
        {/* ==================== VALORES CALCULADOS ==================== */}
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-muted-foreground mb-4">
            VALORES CALCULADOS PELO SISTEMA
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <DataDisplay
              label="Total Produtos"
              value={format(totals?.totalProdutos)}
            />
            <DataDisplay label="Base ICMS" value={format(totals?.baseIcms)} />
            <DataDisplay label="Valor ICMS" value={format(totals?.valorIcms)} />
            <DataDisplay
              label="Base ICMS ST"
              value={format(totals?.baseIcmsSt)}
            />
            <DataDisplay
              label="Valor ICMS ST"
              value={format(totals?.valorIcmsSt)}
            />
            <DataDisplay label="Valor IPI" value={format(totals?.valorIpi)} />
          </div>
        </div>

        {/* ==================== TOTAL FINAL ==================== */}
        <div className="flex justify-end">
          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground tracking-wider mb-1">
              TOTAL DA NOTA FISCAL
            </p>
            <p className="text-4xl font-black tracking-tighter text-primary">
              {format(totals?.totalNota)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DataDisplay({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/40 rounded-xl p-4 border border-border/50">
      <p className="text-xs text-muted-foreground font-medium mb-1.5 tracking-tight">
        {label}
      </p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

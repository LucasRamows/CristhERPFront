import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Badge } from "../../../../components/ui/badge";
import { Switch } from "../../../../components/ui/switch";
import { Separator } from "../../../../components/ui/separator";

import { useEntryNote } from "../../hooks/EntryNoteContext";

export function TransportSection() {
  const {
    form: { transport },
    patchTransport,
  } = useEntryNote();

  const hasTransportData =
    transport?.nome ||
    transport?.cnpj ||
    transport?.placa ||
    transport?.uf;

  return (
    <Card className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-black tracking-tighter">
              Transporte
            </CardTitle>
            <Badge variant="outline" className="text-xs font-normal">
              Opcional
            </Badge>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-2">
          Informações da transportadora e veículo (não obrigatório)
        </p>
      </CardHeader>

      <CardContent className="space-y-8 pb-8">
        {/* Switch para ativar/desativar transporte */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">
              Incluir informações de transporte
            </Label>
            <p className="text-sm text-muted-foreground">
              Ative esta opção caso haja frete ou transportadora
            </p>
          </div>
          <Switch
            checked={!!hasTransportData}
            onCheckedChange={(checked) => {
              if (!checked) {
                patchTransport({
                  nome: "",
                  cnpj: "",
                  placa: "",
                  uf: "",
                });
              }
            }}
          />
        </div>

        <Separator />

        {/* Campos de Transporte - só mostra se tiver dados ou estiver ativado */}
        {(hasTransportData) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2 lg:col-span-2">
              <Label>Transportadora</Label>
              <Input
                value={transport?.nome || ""}
                placeholder="Nome da transportadora"
                onChange={(e) => patchTransport({ nome: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>CNPJ da Transportadora</Label>
              <Input
                value={transport?.cnpj || ""}
                placeholder="00.000.000/0000-00"
                onChange={(e) => patchTransport({ cnpj: e.target.value })}
                className="h-11 font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label>Placa do Veículo</Label>
              <Input
                value={transport?.placa || ""}
                placeholder="ABC1D23 ou ABC-1234"
                onChange={(e) =>
                  patchTransport({ placa: e.target.value.toUpperCase() })
                }
                className="h-11 font-mono uppercase"
              />
            </div>

            <div className="space-y-2">
              <Label>UF da Placa</Label>
              <Input
                value={transport?.uf || ""}
                maxLength={2}
                placeholder="UF"
                onChange={(e) =>
                  patchTransport({ uf: e.target.value.toUpperCase() })
                }
                className="h-11 uppercase font-medium text-center"
              />
            </div>
          </div>
        )}

        {/* Mensagem quando não há transporte */}
        {!hasTransportData && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">
              Nenhuma informação de transporte adicionada.
            </p>
            <p className="text-xs mt-1">
              Ative o switch acima se precisar informar transportadora ou veículo.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import { SearchListPicker } from "../../../../components/shared/SearchListPicker";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Separator } from "../../../../components/ui/separator";
import { formatDocument } from "../../../../lib/utils";

import { useEntryNote } from "../../hooks/EntryNoteContext";   // ← Novo hook

export function SupplierSection() {
  const {
    form,
    availableSuppliers,
    patchSupplier,
    importedFields,
  } = useEntryNote();

  const supplier = form.supplier || {};

  return (
    <Card className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-6 pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-black tracking-tighter">
            Fornecedor
          </CardTitle>
        </div>

        {/* Busca de Fornecedor */}
        <div className="flex gap-2 mt-4">
          <SearchListPicker
            items={availableSuppliers}
            placeholder="Buscar fornecedor cadastrado..."
            searchKeys={["name", "identification"]}
            onSelect={(s: any) => {
              patchSupplier({
                id: s.id,
                cnpj: s.identification,
                razaoSocial: s.name,
                ie: s.ie,
                cidade: s.city,
                uf: s.state || s.estado,
              });
            }}
            renderItem={(s: any) => (
              <div className="flex flex-col py-1.5">
                <span className="font-semibold text-sm">
                  {s.razaoSocial || s.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  CNPJ: {formatDocument(s.cnpj || s.identification)}
                </span>
              </div>
            )}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pb-8">
        {/* INFORMAÇÕES BÁSICAS */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 tracking-tight">
            INFORMAÇÕES BÁSICAS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label>Razão Social</Label>
              <Input
                value={supplier.razaoSocial || ""}
                disabled={importedFields?.["supplier.razaoSocial"]}
                placeholder="Nome completo da empresa"
                onChange={(e) => patchSupplier({ razaoSocial: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input
                value={formatDocument(supplier.cnpj) || ""}
                disabled={importedFields?.["supplier.cnpj"]}
                placeholder="00.000.000/0000-00"
                onChange={(e) => patchSupplier({ cnpj: e.target.value })}
                className="h-11 font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label>Inscrição Estadual (IE)</Label>
              <Input
                value={supplier.ie || ""}
                placeholder="Isento ou número da IE"
                onChange={(e) => patchSupplier({ ie: e.target.value })}
                className="h-11 font-mono"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* ENDEREÇO */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 tracking-tight">
            ENDEREÇO
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label>Endereço (Rua)</Label>
              <Input
                value={supplier.rua || ""}
                placeholder="Rua, Avenida, etc."
                onChange={(e) => patchSupplier({ rua: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Número</Label>
              <Input
                value={supplier.numero || ""}
                placeholder="123"
                onChange={(e) => patchSupplier({ numero: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input
                value={supplier.bairro || ""}
                placeholder="Bairro"
                onChange={(e) => patchSupplier({ bairro: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input
                value={supplier.cidade || ""}
                placeholder="Cidade"
                onChange={(e) => patchSupplier({ cidade: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>UF</Label>
              <Input
                value={supplier.uf || ""}
                maxLength={2}
                placeholder="UF"
                onChange={(e) =>
                  patchSupplier({ uf: e.target.value.toUpperCase() })
                }
                className="h-11 uppercase font-medium text-center"
              />
            </div>

            <div className="space-y-2">
              <Label>CEP</Label>
              <Input
                value={supplier.cep || ""}
                placeholder="00000-000"
                onChange={(e) => patchSupplier({ cep: e.target.value })}
                className="h-11 font-mono"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
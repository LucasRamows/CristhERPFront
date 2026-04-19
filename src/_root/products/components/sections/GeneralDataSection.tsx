import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import { CalendarIcon } from "lucide-react";
import { PopoverContent } from "../../../../components/ui/popover";
import { Calendar } from "../../../../components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

import { useEntryNote } from "../../hooks/EntryNoteContext";   // ← Novo hook

export function GeneralDataSection() {
  const { form, patch, importedFields } = useEntryNote();

  return (
    <Card className="rounded-xl shadow-sm relative overflow-hidden border-none bg-card">
      <div className="absolute top-0 left-0 w-full h-1 bg-decoration" />
      
      <CardHeader className="pb-3 pt-6">
        <CardTitle className="text-lg font-black uppercase tracking-tighter">
          Dados Gerais
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Número da Nota */}
        <div className="space-y-1">
          <Label>Número</Label>
          <Input
            value={form.numero}
            disabled={importedFields?.numero}
            onChange={(e) => patch({ numero: e.target.value })}
            placeholder="000000000"
          />
        </div>

        {/* Série */}
        <div className="space-y-1">
          <Label>Série</Label>
          <Input
            value={form.serie}
            disabled={importedFields?.serie}
            onChange={(e) => patch({ serie: e.target.value })}
            placeholder="1"
          />
        </div>

        {/* Modelo */}
        <div className="space-y-1">
          <Label>Modelo</Label>
          <Input
            value={form.modelo}
            disabled={importedFields?.modelo}
            onChange={(e) => patch({ modelo: e.target.value })}
            placeholder="55"
          />
        </div>

        {/* CFOP */}
        <div className="space-y-1">
          <Label>CFOP Padrão</Label>
          <Input
            value={form.cfop}
            onChange={(e) => patch({ cfop: e.target.value })}
            placeholder="5102"
          />
        </div>

        {/* Data de Emissão */}
        <div className="space-y-1">
          <Label>Data de Emissão</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !form.dataEmissao ? "text-muted-foreground" : ""
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.dataEmissao 
                  ? format(new Date(form.dataEmissao), "dd/MM/yyyy")
                  : "Selecione a data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-60" align="start">
              <Calendar
                mode="single"
                selected={form.dataEmissao ? new Date(form.dataEmissao) : undefined}
                onSelect={(date) => 
                  patch({ dataEmissao: date ? date.toISOString().split("T")[0] : "" })
                }
                disabled={{ after: new Date() }}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Data de Entrada */}
        <div className="space-y-1">
          <Label>Data de Entrada</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !form.dataEntrada ? "text-muted-foreground" : ""
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.dataEntrada 
                  ? format(new Date(form.dataEntrada), "dd/MM/yyyy")
                  : "Selecione a data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-60" align="start">
              <Calendar
                mode="single"
                selected={form.dataEntrada ? new Date(form.dataEntrada) : undefined}
                onSelect={(date) => 
                  patch({ dataEntrada: date ? date.toISOString().split("T")[0] : "" })
                }
                disabled={{ after: new Date() }}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
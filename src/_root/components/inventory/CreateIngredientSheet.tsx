import { X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import {
  inventoryService,
  type IngredientResponse,
} from "../../../services/inventory/inventory.service";

interface CreateIngredientSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (ing: IngredientResponse) => void;
}

export function CreateIngredientSheet({
  isOpen,
  onClose,
  onCreated,
}: CreateIngredientSheetProps) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("UN");
  const [minStock, setMinStock] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      setIsLoading(true);
      const newIng = await inventoryService.createIngredient({
        name,
        unit,
        minStock: Number(minStock),
      });
      toast.success("Insumo criado com sucesso!");
      onCreated(newIng);
      setName("");
      setUnit("UN");
      setMinStock(0);
    } catch (err) {
      console.error("Erro ao criar insumo:", err);
      toast.error("Erro ao criar insumo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-[450px] p-0 flex flex-col h-full bg-background border-l border-border outline-none [&>button]:hidden text-left"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Novo Insumo</SheetTitle>
        </SheetHeader>

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-border flex items-center justify-between bg-muted/50 shrink-0">
          <div>
            <p className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] mb-1">
              Estoque • Insumos
            </p>
            <h2 className="text-2xl font-black text-foreground">
              Novo Insumo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-sm border border-border hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative"
        >
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Nome da Matéria-Prima
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Alface Americana"
                className="w-full h-14 px-5 bg-muted/50 border border-border rounded-[20px] focus:bg-background focus:border-primary outline-none transition-all font-semibold"
              />
            </div>

            <div className="space-y-4 p-5 bg-muted/30 rounded-[28px] border border-border">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  Unidade de Medida
                </label>
              </div>
              <div className="flex gap-3">
                {["UN", "KG", "L"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`flex-1 h-14 rounded-[20px] text-[11px] font-black transition-all duration-300 border-2 ${
                      unit === u
                        ? "bg-foreground text-background border-foreground shadow-xl scale-[1.02]"
                        : "bg-background border-border text-muted-foreground hover:border-muted-foreground/30"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Estoque Mínimo
              </label>
              <input
                type="number"
                value={minStock || ""}
                onChange={(e) => setMinStock(Number(e.target.value))}
                placeholder="Ex: 5"
                className="w-full h-14 px-5 bg-muted/50 border border-border rounded-[20px] focus:bg-background focus:border-primary outline-none transition-all font-semibold"
              />
              <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wide px-2">
                O sistema avisará quando o estoque atingir este valor.
              </p>
            </div>
          </div>

          <div className="pt-8 mt-auto sticky bottom-0 bg-background pb-8">
            <button
              type="submit"
              disabled={isLoading || !name}
              className="w-full h-[60px] bg-foreground text-background rounded-[24px] font-black text-sm tracking-widest uppercase hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0 shadow-xl"
            >
              {isLoading ? "Criando..." : "Criar Insumo"}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

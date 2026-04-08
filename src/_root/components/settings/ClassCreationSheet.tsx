import { Plus, Tags, Truck, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "../../../components/ui/sheet";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeClassType: "product" | "supplier";
  onSaveClass: (name: string, type: "product" | "supplier") => Promise<void>;
}

export const ClassCreationSheet: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  activeClassType,
  onSaveClass,
}) => {
  const [newClassName, setNewClassName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) setNewClassName("");
  }, [isOpen]);

  const handleSave = async () => {
    if (!newClassName.trim() || isSaving) return;
    setIsSaving(true);
    await onSaveClass(newClassName.trim(), activeClassType);
    setIsSaving(false);
    onOpenChange(false);
  };

  const isProduct = activeClassType === "product";
  const typeLabel = isProduct ? "Produtos" : "Fornecedores";
  const Icon = isProduct ? Tags : Truck;
  const colorClass = isProduct
    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
    : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-[450px] p-0 flex flex-col md:h-full bg-background outline-none [&>button]:hidden"
      >
        <SheetTitle className="sr-only">Nova Classe de {typeLabel}</SheetTitle>

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
          <div>
            <p className="text-muted-foreground font-bold uppercase tracking-wider text-xs mb-1">
              Gerenciamento
            </p>
            <h2 className="text-2xl font-black text-foreground">Nova Classe</h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-sm border border-border hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar min-h-0">
          <div className="bg-muted/30 rounded-[24px] border border-border overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${colorClass}`}
                  >
                    {typeLabel}
                  </span>
                  <h3 className="text-xl font-black text-foreground mt-2">
                    Cadastro de Classe
                  </h3>
                </div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
                >
                  <Icon size={20} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Nome da Classe
                </label>
                <input
                  autoFocus
                  placeholder={`Ex: ${
                    isProduct ? "Matéria Prima" : "Distribuidores"
                  }...`}
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                  }}
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <p className="text-xs font-bold text-muted-foreground/80 px-1 mt-1">
                  As classes ajudam a organizar seus {typeLabel.toLowerCase()}{" "}
                  de forma estruturada.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-border flex flex-col gap-3 mt-auto shrink-0 bg-background shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={!newClassName.trim() || isSaving}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Plus size={18} className="mr-1" />
            )}
            Criar Classe
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

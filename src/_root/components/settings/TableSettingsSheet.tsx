import { LayoutGrid, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "../../../components/ui/sheet";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialTables: number;
  onSave: (tables: number) => Promise<void>;
  isSaving: boolean;
}

export const TableSettingsSheet: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  initialTables,
  onSave,
  isSaving,
}) => {
  const [totalTables, setTotalTables] = useState(initialTables);

  // Sync state when drawer opens or initialTables update
  useEffect(() => {
    setTotalTables(initialTables);
  }, [initialTables, isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-md p-0 flex flex-col h-full bg-background border-l border-border [&>button]:hidden outline-none pointer-events-auto"
      >
        <SheetTitle className="sr-only">Configurar Mesas</SheetTitle>

        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-2 bg-muted/50 hover:bg-muted text-muted-foreground transition-colors focus:outline-none"
        >
          <X size={16} />
        </button>

        <div className="p-8 space-y-4">
          <div className="p-3 w-fit bg-primary/10 rounded-2xl text-primary">
            <LayoutGrid size={24} />
          </div>
          <div className="flex flex-col space-y-2 text-left">
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              Configurar Mesas
            </h2>
            <p className="text-sm text-muted-foreground">
              Defina a quantidade de mesas disponíveis para visualização.
            </p>
          </div>
        </div>

        <div className="flex-1 px-8 py-4 flex flex-col items-center justify-center space-y-8 overflow-y-auto">
          <div className="bg-muted/20 p-8 rounded-[3rem] border border-border/50 flex flex-col items-center gap-6 w-full max-w-[250px] shadow-inner">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Quantidade Total
            </span>
            <span className="text-7xl font-black text-foreground tracking-tighter">
              {totalTables}
            </span>
            <div className="flex items-center gap-4 w-full">
              <button
                onClick={() => setTotalTables(Math.max(1, totalTables - 1))}
                className="flex-1 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-xl font-bold hover:bg-primary hover:text-primary-foreground transition-all shadow-sm active:scale-95"
              >
                -
              </button>
              <button
                onClick={() => setTotalTables(totalTables + 1)}
                className="flex-1 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-xl font-bold hover:bg-primary hover:text-primary-foreground transition-all shadow-sm active:scale-95"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex flex-col gap-3 mt-auto shrink-0">
          <button
            onClick={() => onSave(totalTables)}
            disabled={isSaving || totalTables === initialTables}
            className="w-full inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-widest shadow-lg shadow-primary/20 h-14 disabled:opacity-50 transition-all"
          >
            {isSaving ? "Atualizando..." : "Salvar Mesas"}
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="w-full inline-flex items-center justify-center rounded-xl text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted h-12 transition-all"
          >
            Cancelar
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

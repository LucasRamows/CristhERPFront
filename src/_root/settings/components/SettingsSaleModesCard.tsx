import { Check, LayoutGrid, Receipt, Store, Zap } from "lucide-react";
import React from "react";

interface Props {
  saleModes: { mesas: boolean; comandas: boolean; caixaRapido: boolean };
  setSaleModes: React.Dispatch<
    React.SetStateAction<{
      mesas: boolean;
      comandas: boolean;
      caixaRapido: boolean;
    }>
  >;
  totalTables: number;
  openTableDrawer: () => void;
}

export const SettingsSaleModesCard: React.FC<Props> = ({
  saleModes,
  setSaleModes,
  totalTables,
  openTableDrawer,
}) => {
  const toggleSaleMode = (mode: keyof typeof saleModes) => {
    setSaleModes((prev) => ({
      ...prev,
      [mode]: !prev[mode],
    }));
  };

  return (
    <section className="bg-card border border-border rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Store size={20} className="text-primary" />
        </div>
        <h3 className="uppercase text-lg font-bold tracking-tight">
          Tipos de Venda
        </h3>
      </div>

      <p className="text-xs text-muted-foreground font-medium mb-2">
        Selecione quais modalidades estarão disponíveis no PDV.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
        <button
          onClick={() => toggleSaleMode("mesas")}
          className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all focus:outline-none ${
            saleModes.mesas
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border bg-card hover:bg-muted/30"
          }`}
        >
          <div
            className={`p-3 rounded-full mb-3 ${
              saleModes.mesas
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <LayoutGrid size={20} />
          </div>
          <span
            className={`text-[11px] font-black uppercase tracking-wider ${
              saleModes.mesas ? "text-primary" : "text-foreground"
            }`}
          >
            Mesas
          </span>
          {saleModes.mesas && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-0.5">
              <Check size={12} strokeWidth={4} />
            </div>
          )}
        </button>

        <button
          onClick={() => toggleSaleMode("comandas")}
          className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all focus:outline-none ${
            saleModes.comandas
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border bg-card hover:bg-muted/30"
          }`}
        >
          <div
            className={`p-3 rounded-full mb-3 ${
              saleModes.comandas
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Receipt size={20} />
          </div>
          <span
            className={`text-[11px] font-black uppercase tracking-wider ${
              saleModes.comandas ? "text-primary" : "text-foreground"
            }`}
          >
            Comandas
          </span>
          {saleModes.comandas && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-0.5">
              <Check size={12} strokeWidth={4} />
            </div>
          )}
        </button>

        <button
          onClick={() => toggleSaleMode("caixaRapido")}
          className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all focus:outline-none ${
            saleModes.caixaRapido
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border bg-card hover:bg-muted/30"
          }`}
        >
          <div
            className={`p-3 rounded-full mb-3 ${
              saleModes.caixaRapido
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Zap size={20} />
          </div>
          <span
            className={`text-[11px] font-black uppercase tracking-wider ${
              saleModes.caixaRapido ? "text-primary" : "text-foreground"
            }`}
          >
            Balcão
          </span>
          {saleModes.caixaRapido && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-0.5">
              <Check size={12} strokeWidth={4} />
            </div>
          )}
        </button>
      </div>

      {saleModes.mesas && (
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold uppercase tracking-tight text-foreground">
              Capacidade Atual: {totalTables} mesas
            </span>
          </div>
          <button
            onClick={openTableDrawer}
            className="inline-flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Configurar Mesas
          </button>
        </div>
      )}
    </section>
  );
};

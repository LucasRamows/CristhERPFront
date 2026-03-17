import { FileSearchIcon, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import apiBack from "../../services/api";
import { Input } from "../../components/ui/input";
import { formatMoney } from "../../lib/utils";

export default function RootFindSalesForm() {
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Busca as vendas ao montar o componente
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await apiBack.get("/sales/all");
        // Garante que é array
        setSales(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSales();
  }, []);

  // Filtra e ordena as vendas
  const filteredSales = useMemo(() => {
    if (!sales) return [];

    // Ordena por data decrescente (mais recente primeiro)
    const sortedSales = [...sales].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const term = searchTerm.toLowerCase();
    if (!term) return sortedSales;

    return sortedSales.filter((sale: any) => {
      const clientName = sale.client?.name?.toLowerCase() || "";
      const saleNumber = sale.saleNumber?.toString() || "";
      return clientName.includes(term) || saleNumber.includes(term);
    });
  }, [sales, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8 h-full items-center">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por número da nota ou cliente..."
          className="pl-9 h-12 bg-muted/30 border-muted-foreground/20 rounded-xl"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          autoFocus
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-4">
        {filteredSales.length > 0 ? (
          filteredSales.map((sale: any) => (
            <button
              key={sale.id}
              //      onClick={() => onSelect(sale)}
              className="w-full flex flex-col gap-2 p-4 rounded-xl border border-border/40 hover:bg-muted/40 hover:border-primary/20 transition-all text-left group bg-card shadow-sm"
            >
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary text-xs font-black px-2 py-1 rounded-md whitespace-nowrap">
                      Nº {sale.saleNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border whitespace-nowrap ${
                        sale.status === "VALIDATED"
                          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800"
                          : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800"
                      }`}
                    >
                      {sale.status === "VALIDATED" ? "Fechada" : "Aberta"}
                    </span>
                  </div>
                  <span className="font-bold text-sm text-foreground/80 truncate w-full">
                    {sale.client?.name}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-black text-foreground">
                    {formatMoney(sale.grossTotal)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end w-full pt-3 border-t border-border/30 mt-1">
                <span className="text-[10px] text-muted-foreground font-mono">
                  {new Date(sale.createdAt).toLocaleDateString("pt-BR")} às{" "}
                  {new Date(sale.createdAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  Abrir <FileSearchIcon size={12} />
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50 gap-3">
            <div className="p-4 bg-muted rounded-full">
              <FileSearchIcon size={24} strokeWidth={1.5} />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide">
              Nenhuma pré-nota encontrada
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

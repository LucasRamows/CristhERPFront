import { History, Package, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../../../components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  inventoryService,
  type InventoryMovement,
  type ItemResponse,
} from "../../../services/inventory/inventory.service";
import { HistorySection } from "./history/HistorySection";
import { StockAdjustmentSheet } from "./adjustment/Stockadjustmentsheet";

interface InventoryHistorySheetProps {
  item: ItemResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onAdjusted?: (item: ItemResponse) => void;
}

export function InventoryHistorySheet({
  item,
  isOpen,
  onAdjusted,
  onClose,
}: InventoryHistorySheetProps) {
  const [history, setHistory] = useState<InventoryMovement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);

  const fetchHistory = async () => {
    if (!item?.id) return;
    try {
      setIsLoading(true);
      const data = await inventoryService.getItemHistory(item.id);
      setHistory(data);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && item?.id) {
      fetchHistory();
    }
  }, [isOpen, item?.id]);

  if (!item) return null;

  const currentStock = Number(item.currentStock || 0);
  const minStock = Number(item.minStock || 0);
  const hasMinStock = minStock > 0;
  const isLowStock = hasMinStock && currentStock <= minStock;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-[500px] p-0 flex flex-col h-full bg-background outline-none [&>button]:hidden border-l border-border text-left"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Histórico de {item.name}</SheetTitle>
        </SheetHeader>

        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-border bg-muted/50 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none text-foreground">
            <Package size={120} />
          </div>

          <div className="flex justify-between items-start relative z-10 gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  className={
                    isLowStock
                      ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border-none px-2.5 py-1 text-[9px] font-black tracking-widest"
                      : !hasMinStock
                      ? "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-none px-2.5 py-1 text-[9px] font-black tracking-widest"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none px-2.5 py-1 text-[9px] font-black tracking-widest"
                  }
                >
                  {isLowStock
                    ? "ESTOQUE CRÍTICO"
                    : !hasMinStock
                    ? "SEM MÍNIMO"
                    : "ESTOQUE SAUDÁVEL"}
                </Badge>
              </div>
              <h2 className="text-2xl font-black text-foreground tracking-tighter leading-none mb-4 uppercase truncate">
                {item.name}
              </h2>
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">
                    Disponível
                  </span>
                  <span
                    className={`text-2xl font-black tracking-tighter ${
                      isLowStock
                        ? "text-destructive"
                        : hasMinStock
                        ? "text-emerald-500"
                        : "text-foreground"
                    }`}
                  >
                    {currentStock}{" "}
                    <span className="text-xs opacity-40">{item.unit}</span>
                  </span>
                </div>
                {hasMinStock && (
                  <>
                    <div className="w-px h-10 bg-border" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">
                        Mínimo
                      </span>
                      <span className="text-2xl font-black text-muted-foreground tracking-tighter">
                        {minStock}{" "}
                        <span className="text-xs opacity-40">{item.unit}</span>
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-sm border border-border hover:bg-muted text-muted-foreground transition-all active:scale-90 shrink-0 mt-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* History Tabs */}
        <div className="flex-1 flex flex-col min-h-0 bg-background">
          <Tabs defaultValue="all" className="flex-1 flex flex-col h-full">
            <div className="px-6 md:px-8 py-4 border-b border-border bg-background shrink-0">
              <TabsList className="bg-muted p-1 rounded-2xl w-full h-12 shadow-sm border border-border/50">
                <TabsTrigger
                  value="all"
                  className="flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-muted-foreground data-[state=active]:text-foreground"
                >
                  Tudo
                </TabsTrigger>
                <TabsTrigger
                  value="entries"
                  className="flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm text-emerald-600 dark:text-emerald-400 transition-all"
                >
                  Entradas
                </TabsTrigger>
                <TabsTrigger
                  value="outputs"
                  className="flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm text-destructive dark:text-destructive-400 transition-all"
                >
                  Saídas
                </TabsTrigger>
                <TabsTrigger
                  value="adjustments"
                  className="flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm text-blue-600 dark:text-blue-400 transition-all"
                >
                  Balanço
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 pb-32 min-h-0 bg-background relative">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center py-12 text-muted-foreground gap-4">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent animate-spin rounded-full" />
                  <p className="font-extrabold animate-pulse uppercase tracking-widest text-[9px]">
                    Sincronizando estoque...
                  </p>
                </div>
              ) : (
                <>
                  <TabsContent
                    value="all"
                    className="mt-0 space-y-6 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <HistorySection
                      title="Movimentações Recentes"
                      selectedUnit={item.unit}
                      items={history.sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime(),
                      )}
                    />
                  </TabsContent>

                  <TabsContent
                    value="entries"
                    className="mt-0 space-y-6 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <HistorySection
                      title="Entradas Realizadas"
                      items={history.filter((h) => h.type === "IN")}
                      selectedUnit={item.unit}
                    />
                  </TabsContent>

                  <TabsContent
                    value="outputs"
                    className="mt-0 space-y-6 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <HistorySection
                      title="Consumo Geral"
                      items={history.filter((h) => h.type === "OUT")}
                      selectedUnit={item.unit}
                    />
                  </TabsContent>

                  <TabsContent
                    value="adjustments"
                    className="mt-0 space-y-6 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    {!isAdjustOpen ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
                          <Package size={32} />
                        </div>
                        <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-2">
                          Balanço Físico
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider max-w-xs mb-8 leading-relaxed">
                          O estoque do sistema não bate com o físico? Realize um
                          ajuste justificando o motivo da quebra ou sobra.
                        </p>
                        <button
                          onClick={() => setIsAdjustOpen(true)}
                          className="bg-primary text-primary-foreground font-black text-xs px-6 py-4 rounded-2xl uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-primary/20"
                        >
                          Realizar Ajuste de Estoque
                        </button>
                      </div>
                    ) : (
                      <StockAdjustmentSheet
                        item={item}
                        isOpen={isAdjustOpen}
                        onClose={() => setIsAdjustOpen(false)}
                        onConfirm={async (adjItem, delta) => {
                          try {
                            const updatedItem =
                              await inventoryService.balanceStock(
                                adjItem.id,
                                delta,
                              );
                            onAdjusted?.(updatedItem);
                            await fetchHistory();
                            setIsAdjustOpen(false);
                          } catch (error) {
                            console.error("Erro no ajuste:", error);
                          }
                        }}
                      />
                    )}
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </div>

        {/* Footer Info */}
        <div className="p-6 border-t border-border bg-muted/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <History size={16} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Histórico em tempo real
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

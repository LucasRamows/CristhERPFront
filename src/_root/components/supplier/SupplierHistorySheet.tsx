import { 
  Calendar, 
  ChevronRight, 
  FileText, 
  History, 
  ShoppingCart, 
  X 
} from "lucide-react";
import { useEffect, useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "../../../components/ui/sheet";
import { formatMoney } from "../../../lib/utils";
import type { InventoryEntryResponse } from "../../../services/inventory/inventory.service";
import { 
  suppliersService, 
  type SupplierResponse 
} from "../../../services/suppliers/suppliers.service";

interface SupplierHistorySheetProps {
  supplier: SupplierResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SupplierHistorySheet({
  supplier,
  isOpen,
  onClose,
}: SupplierHistorySheetProps) {
  const [history, setHistory] = useState<InventoryEntryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  useEffect(() => {
    if (supplier && isOpen) {
      fetchHistory();
    }
  }, [supplier, isOpen]);

  const fetchHistory = async () => {
    if (!supplier) return;
    try {
      setIsLoading(true);
      const data = await suppliersService.getSupplierHistory(supplier.id);
      setHistory(data);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(new Date(dateString));
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-[480px] p-0 flex flex-col h-full bg-background border-l border-border outline-none [&>button]:hidden text-left"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Histórico de Compras - {supplier?.name}</SheetTitle>
        </SheetHeader>

        {/* Header */}
        <div className="p-8 border-b border-border flex items-center justify-between bg-muted/50 shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <History size={14} className="text-primary" />
              <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">
                Histórico de Suprimentos
              </p>
            </div>
            <h2 className="text-2xl font-black text-foreground truncate">
              {supplier?.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-sm border border-border hover:bg-muted text-muted-foreground transition-all active:scale-95 shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
          {isLoading ? (
            <div className="h-full flex items-center justify-center pb-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent animate-spin rounded-full" />
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest animate-pulse">Buscando histórico...</p>
              </div>
            </div>
          ) : !history || history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 opacity-50 italic pb-20">
              <ShoppingCart size={48} />
              <p className="font-bold text-sm">Nenhuma compra registrada</p>
            </div>
          ) : (
            <div className="space-y-6 pb-24">
              {history.map((entry) => (
                <div 
                  key={entry.id}
                  className="bg-card border border-border rounded-[28px] overflow-hidden transition-all shadow-sm hover:border-primary/20 group"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                            Entrada
                          </span>
                          <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-bold">
                            <Calendar size={12} />
                            {formatDate(entry.date)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                          <FileText size={14} className="text-muted-foreground" />
                          <span className="text-sm font-black text-foreground">
                            DOC: {entry.documentRef}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">
                          Valor Final
                        </p>
                        <p className="text-lg font-black text-emerald-500">
                          {formatMoney(entry.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
                      className={`w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 ${
                        selectedEntry === entry.id 
                        ? 'bg-foreground text-background' 
                        : 'bg-background border border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {selectedEntry === entry.id ? 'Ocultar Detalhes' : 'Ver Itens da Nota'}
                      <ChevronRight size={14} className={`transition-transform duration-300 ${selectedEntry === entry.id ? 'rotate-90' : ''}`} />
                    </button>
                  </div>

                  {/* Items List */}
                  {selectedEntry === entry.id && (
                    <div className="p-6 bg-muted/30 border-t border-border animate-in slide-in-from-top-4 duration-500">
                      <div className="space-y-4">
                        {entry.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center bg-background p-3 rounded-2xl border border-dashed border-border">
                            <div className="flex items-center gap-3">
                              <span className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black text-xs">
                                {item.quantity}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-black text-foreground text-xs uppercase tracking-tight">
                                  {item.ingredient?.name || `Insumo #${item.ingredientId.slice(-4)}`}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                  {formatMoney(item.unitPrice)} p/ {item.ingredient?.unit || 'un'}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-black text-sm text-foreground">
                                {formatMoney(item.quantity * item.unitPrice)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

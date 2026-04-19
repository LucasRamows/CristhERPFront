import {
  Building2,
  Hash,
  Info,
  Mail,
  Phone,
  Save,
  ShoppingCart,
  Trash2,
  X,
  Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AddressForm } from "../../../components/shared/AddressForm";
import { PageTabNavigation } from "../../../components/shared/PageTabNavigation";
import { Button } from "../../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { formatDocument, formatMoney, formatPhone } from "../../../lib/utils";
import {
  suppliersService,
  type SupplierResponse,
} from "../../../services/suppliers/suppliers.service";
import type { InventoryEntryResponse } from "../../../services/inventory/inventory.service";

interface SupplierHistorySheetProps {
  supplier: SupplierResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (sup: SupplierResponse) => void;
  onDelete?: (id: string) => void;
  onEditNote?: (note: any) => void;
}

const detailTabs = [
  { id: "info", label: "Dados Gerais", businessType: "ALL" },
  { id: "history", label: "Pedidos / Histórico", businessType: "ALL" },
];

export function SupplierHistorySheet({
  supplier,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onEditNote,
}: SupplierHistorySheetProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [history, setHistory] = useState<InventoryEntryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    identification: "",
    addresses: {
      street: "",
      streetNumber: "",
      neighborhood: "",
      city: "",
      uf: "",
      country: "Brasil",
      complement: "",
      mainAddress: true,
      cep: "",
    },
    category: "Geral",
  });

  useEffect(() => {
    if (supplier && isOpen) {
      setFormData({
        name: supplier.name || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        identification: supplier.identification || "",
        addresses: supplier.addresses?.[0] || {
          street: "",
          streetNumber: "",
          neighborhood: "",
          city: "",
          uf: "",
          country: "Brasil",
          complement: "",
          mainAddress: true,
          cep: "",
        },
        category: supplier.category || "Geral",
      });
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

  const handleUpdate = async () => {
    if (!supplier || !formData.name) return;
    try {
      setIsUpdating(true);
      const updated = await suppliersService.updateSupplier(
        supplier.id,
        formData,
      );
      onUpdate?.(updated);
      toast.success("Fornecedor atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar fornecedor.");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(dateString));
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[95%] sm:max-w-[540px] p-0 flex flex-col h-full bg-background border-l border-border outline-none [&>button]:hidden text-left"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Fornecedor - {supplier?.name}</SheetTitle>
        </SheetHeader>

        {/* Header */}
        <div className="p-8 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={14} className="text-primary" />
              <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">
                Gestão de Fornecedor
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

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <PageTabNavigation
            tabs={detailTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === "info" && (
            <div className="p-8 space-y-8 animate-in fade-in duration-300 pb-32">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
                  Identificação do Parceiro
                </h4>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                    Nome Fantasia / Razão Social
                  </label>
                  <div className="relative">
                    <Building2
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full h-14 pl-12 pr-5 bg-muted/30 border border-border rounded-[20px] focus:bg-background outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                      CNPJ / CPF
                    </label>
                    <div className="relative">
                      <Hash
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
                        size={18}
                      />
                      <input
                        type="text"
                        value={formatDocument(formData.identification)}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            identification: e.target.value,
                          })
                        }
                        className="w-full h-14 pl-12 pr-5 bg-muted/30 border border-border rounded-[20px] focus:bg-background outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                      Categoria
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full h-14 px-5 bg-muted/30 border border-border rounded-[20px] focus:bg-background outline-none transition-all font-semibold appearance-none"
                    >
                      <option>Geral</option>
                      <option>Alimentos</option>
                      <option>Bebidas</option>
                      <option>Limpeza</option>
                      <option>Logística</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                      Telefone
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
                        size={18}
                      />
                      <input
                        type="text"
                        value={formatPhone(formData.phone)}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full h-14 pl-12 pr-5 bg-muted/30 border border-border rounded-[20px] focus:bg-background outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
                        size={18}
                      />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full h-14 pl-12 pr-5 bg-muted/30 border border-border rounded-[20px] focus:bg-background outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
                  Localização
                </h4>
                <AddressForm formData={formData} setFormData={setFormData} />
              </div>

              <div className="pt-8 flex gap-3">
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-1 h-14 rounded-2xl gap-2 font-black uppercase text-xs"
                >
                  <Save size={18} />
                  {isUpdating ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => supplier && onDelete?.(supplier.id)}
                  className="w-14 h-14 rounded-2xl p-0 flex items-center justify-center shrink-0"
                >
                  <Trash2 size={20} />
                </Button>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="p-8 animate-in fade-in duration-300 relative">
              {isLoading ? (
                <div className="h-full py-20 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent animate-spin rounded-full" />
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest animate-pulse">
                      Buscando histórico...
                    </p>
                  </div>
                </div>
              ) : !history || history.length === 0 ? (
                <div className="h-full py-20 flex flex-col items-center justify-center text-muted-foreground gap-4 opacity-50 italic">
                  <ShoppingCart size={48} />
                  <p className="font-bold text-sm">Nenhuma compra registrada</p>
                </div>
              ) : (
                <div className="space-y-4 pb-24">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm hover:border-primary/20 transition-all"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                Entrada
                              </span>
                              <span className="text-[10px] font-bold text-zinc-400">
                                {formatDate(entry.date)}
                              </span>
                            </div>
                            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                              DOC: {entry.documentRef}
                            </h3>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-zinc-400 uppercase">
                              Valor Final
                            </p>
                            <p className="text-xl font-black text-emerald-500">
                              {formatMoney(entry.totalAmount)}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1 rounded-xl font-bold gap-2 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
                            onClick={() =>
                              setSelectedEntry(
                                entry.id === selectedEntry ? null : entry.id,
                              )
                            }
                          >
                            <Info size={16} />
                            {selectedEntry === entry.id
                              ? "Ocultar Detalhes"
                              : "Ver Itens da Nota"}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1 rounded-xl font-bold gap-2 bg-[#E2F898] text-gray-900 hover:bg-[#d4e98a] border-none"
                            onClick={() => {
                              if (onEditNote) {
                                onClose();
                                onEditNote(entry);
                              }
                            }}
                          >
                            <Pencil size={16} />
                            Alterar
                          </Button>
                        </div>
                      </div>

                      {/* Items List */}
                      {selectedEntry === entry.id && (
                        <div className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 p-5 animate-in slide-in-from-top-2 duration-200">
                          <p className="text-[10px] font-black text-zinc-400 uppercase mb-3">
                            Itens do Suprimento
                          </p>
                          <div className="space-y-3">
                            {entry.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center text-sm p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-black text-xs">
                                    {item.quantity}
                                  </span>
                                  <div className="flex flex-col">
                                    <span className="font-black text-zinc-900 dark:text-zinc-100 uppercase text-xs">
                                      {item.ingredient?.name ||
                                        `Insumo #${item.ingredientId.slice(
                                          -4,
                                        )}`}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase">
                                      {formatMoney(item.unitPrice)} p/{" "}
                                      {item.ingredient?.unit || "un"}
                                    </span>
                                  </div>
                                </div>
                                <span className="font-black text-zinc-900 dark:text-zinc-100">
                                  {formatMoney(item.quantity * item.unitPrice)}
                                </span>
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
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

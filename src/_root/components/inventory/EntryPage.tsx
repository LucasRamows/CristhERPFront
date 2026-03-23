import {
  Building2,
  Calendar,
  CheckCircle,
  FileText,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoadingComponent from "../../../components/shared/LoadingComponent";
import { SearhListPicker } from "../../../components/shared/SearhListPicker";
import { formatDocument, formatMoney } from "../../../lib/utils";
import {
  inventoryService,
  type CreateInventoryEntryItem,
  type IngredientResponse,
} from "../../../services/inventory/inventory.service";
import {
  suppliersService,
  type SupplierResponse,
} from "../../../services/suppliers/suppliers.service";
import { CreateIngredientSheet } from "./CreateIngredientSheet";

interface EntryItem extends CreateInventoryEntryItem {
  name: string;
  unit: string;
}

export default function InventoryEntryPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);
  const [availableSuppliers, setAvailableSuppliers] = useState<
    SupplierResponse[]
  >([]);

  // Note Header State
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierResponse | null>(null);
  const [docRef, setDocRef] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Items State
  const [items, setItems] = useState<EntryItem[]>([]);

  // UI State
  const [isCreateIngredientOpen, setIsCreateIngredientOpen] = useState(false);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [ingredientsData, suppliersData] = await Promise.all([
        inventoryService.getIngredients(),
        suppliersService.getSuppliers(),
      ]);
      setIngredients(ingredientsData);
      setAvailableSuppliers(suppliersData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar lista de insumos/fornecedores.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAddIngredient = (ingredient: IngredientResponse) => {
    const exists = items.find((i) => i.ingredientId === ingredient.id);
    if (exists) {
      toast.info("Este insumo já está na nota.");
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        ingredientId: ingredient.id,
        name: ingredient.name,
        unit: ingredient.unit,
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const updateItem = (id: string, updates: Partial<EntryItem>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.ingredientId === id ? { ...item, ...updates } : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.ingredientId !== id));
  };

  const total = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  }, [items]);

  const handleSave = async () => {
    if (!selectedSupplier || !docRef || items.length === 0) {
      toast.warning(
        "Preencha o fornecedor, documento e adicione pelo menos um item.",
      );
      return;
    }

    try {
      setIsSubmitLoading(true);
      await inventoryService.createInventoryEntry({
        supplierId: selectedSupplier.id,
        documentRef: docRef,
        date,
        totalAmount: total,
        items: items.map(({ ingredientId, quantity, unitPrice }) => ({
          ingredientId,
          quantity,
          unitPrice,
        })),
      });
      toast.success("Nota de entrada lançada com sucesso!");
      navigate(-1);
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      toast.error("Erro ao salvar nota de entrada.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  if (isLoading) return <LoadingComponent />;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden select-none">
      {/* Header Fixo */}
      <div className="px-6 py-4 bg-card border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 relative z-40">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-full font-bold text-sm text-muted-foreground hover:bg-muted transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitLoading || items.length === 0}
            className="px-8 py-2.5 bg-foreground text-background rounded-full font-black text-sm tracking-wide hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
          >
            {isSubmitLoading ? (
              <div className="w-4 h-4 border-2 border-background border-t-transparent animate-spin rounded-full" />
            ) : (
              <CheckCircle size={18} />
            )}
            {isSubmitLoading ? "PROCESSANDO..." : "CONFIRMAR ENTRADA"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Esquerda: Itens da Nota */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden gap-6">
          {/* Header Note Info & Supplier Info */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-card p-6 rounded-[32px] border border-border shadow-sm relative overflow-visible">
              <div className="space-y-1.5 z-50 relative">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">
                  Fornecedor
                </label>
                <div className="relative">
                  <SearhListPicker
                    items={availableSuppliers}
                    onSelect={(item) => setSelectedSupplier(item)}
                    placeholder="Selecione o Fornecedor..."
                    searchKeys={["name", "identification"]}
                    renderItem={(item) => (
                      <div className="flex items-center gap-3 py-1 text-left">
                        <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                          <Building2 size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-foreground">
                            {item.name}
                          </span>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-1.5 relative z-40">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">
                  Nº Documento / Nota
                </label>
                <div className="relative">
                  <FileText
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    type="text"
                    value={docRef}
                    onChange={(e) => setDocRef(e.target.value)}
                    placeholder="Ex: 598210"
                    className="w-full h-12 pl-11 pr-4 bg-muted border border-border rounded-2xl focus:bg-background focus:border-primary outline-none transition-all font-semibold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5 relative z-40">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">
                  Data de Entrada
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 bg-muted border border-border rounded-2xl focus:bg-background focus:border-primary outline-none transition-all font-semibold text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Supplier Details Card (Aparece ao selecionar) */}
            {selectedSupplier && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-foreground p-6 rounded-[28px] text-background transition-all animate-in slide-in-from-top-2 duration-300 relative z-30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-background/20 flex items-center justify-center">
                    <Briefcase size={18} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[9px] font-black uppercase opacity-50">
                      Documento CNPJ
                    </p>
                    <p className="text-xs font-bold leading-tight line-clamp-1">
                      {formatDocument(
                        selectedSupplier.identification || "Não informado",
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-background/20 flex items-center justify-center">
                    <Phone size={18} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[9px] font-black uppercase opacity-50">
                      Telefone
                    </p>
                    <p className="text-xs font-bold leading-tight">
                      {selectedSupplier.phone || "Não informado"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-background/20 flex items-center justify-center">
                    <Mail size={18} />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-[9px] font-black uppercase opacity-50">
                      E-mail
                    </p>
                    <p className="text-xs font-bold leading-tight line-clamp-1">
                      {selectedSupplier.email || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Table Items */}
          <div className="flex-1 bg-card rounded-[32px] border border-border shadow-sm overflow-hidden flex flex-col relative z-20">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-black text-lg text-foreground flex items-center gap-2">
                <ShoppingCart size={20} className="text-primary" />
                Itens da Nota
              </h2>
              <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-black text-muted-foreground uppercase">
                {items.length} Itens Adicionados
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                  <Package size={64} className="opacity-10 mb-4" />
                  <p className="font-bold text-lg">
                    Nenhum item adicionado ainda
                  </p>
                  <p className="text-sm border-none">
                    Use o campo de busca ao lado para adicionar insumos à nota.
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-muted text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">
                    <tr>
                      <th className="px-8 py-4 text-left">Insumo</th>
                      <th className="px-6 py-4 text-center w-32">Quantidade</th>
                      <th className="px-6 py-4 text-center w-40">
                        Preço Unit.
                      </th>
                      <th className="px-6 py-4 text-center w-32">Subtotal</th>
                      <th className="px-8 py-4 text-right w-20"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {items.map((item) => (
                      <tr
                        key={item.ingredientId}
                        className="group hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground text-lg">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                              {item.unit}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center bg-muted rounded-xl p-1">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(item.ingredientId, {
                                  quantity: Number(e.target.value),
                                })
                              }
                              className="w-full bg-transparent border-none text-center font-black text-foreground focus:outline-none"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-1 bg-muted rounded-xl px-3 py-1.5">
                            <span className="text-xs font-bold text-muted-foreground">
                              R$
                            </span>
                            <input
                              type="number"
                              value={item.unitPrice || ""}
                              onChange={(e) =>
                                updateItem(item.ingredientId, {
                                  unitPrice: Number(e.target.value),
                                })
                              }
                              placeholder="0,00"
                              className="w-full bg-transparent border-none font-black text-foreground focus:outline-none text-sm"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center font-black text-foreground">
                          {formatMoney(item.quantity * item.unitPrice)}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => removeItem(item.ingredientId)}
                            className="p-2.5 text-destructive hover:bg-destructive/10 rounded-xl transition-all active:scale-95"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Total Footer */}
            {items.length > 0 && (
              <div className="p-8 bg-foreground text-background flex items-center justify-between shadow-2xl">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    Valor Total da Nota
                  </p>
                  <p className="text-3xl font-black">{formatMoney(total)}</p>
                </div>
                <div className="flex flex-col text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    Itens Lançados
                  </p>
                  <p className="font-black text-xl">{items.length}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Direita: Busca e Ações Rápidas */}
        <div className="w-[400px] border-l border-border bg-card p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar relative z-30">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
              Adicionar Insumos
            </h3>

            <div className="relative">
              <SearhListPicker
                items={ingredients}
                onSelect={(item) => handleAddIngredient(item)}
                placeholder="Buscar insumo por nome..."
                searchKeys={["name"]}
                limit={5}
                renderItem={(item) => (
                  <div className="flex items-center gap-3 py-1 text-left">
                    <div className="w-10 h-10 bg-muted rounded-2xl flex items-center justify-center border border-border text-muted-foreground group-hover:bg-primary group-hover:text-background transition-colors">
                      <Package size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-foreground">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        {item.unit}
                      </span>
                    </div>
                  </div>
                )}
              />
            </div>

            <button
              onClick={() => setIsCreateIngredientOpen(true)}
              className="w-full p-6 border-2 border-dashed border-border rounded-[32px] flex flex-col items-center justify-center gap-3 text-muted-foreground hover:border-primary hover:text-primary transition-all group active:scale-95"
            >
              <div className="w-12 h-12 bg-muted rounded-[20px] flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Plus
                  size={24}
                  className="group-hover:scale-125 transition-transform"
                />
              </div>
              <span className="font-black text-xs uppercase tracking-widest text-center">
                Criar Novo
                <br />
                Insumo
              </span>
            </button>
          </div>

          <div className="mt-auto pt-6 border-t border-border space-y-4">
            <div className="p-5 bg-primary/5 rounded-[24px] border border-primary/10">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">
                Dica de Gestão
              </p>
              <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                Ao lançar a nota manual, o estoque será atualizado imediatamente
                e um lançamento no contas a pagar será gerado automaticamente se
                configurado.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CreateIngredientSheet
        isOpen={isCreateIngredientOpen}
        onClose={() => setIsCreateIngredientOpen(false)}
        onCreated={(newIng) => {
          setIngredients((prev) => [...prev, newIng]);
          handleAddIngredient(newIng);
          setIsCreateIngredientOpen(false);
        }}
      />
    </div>
  );
}

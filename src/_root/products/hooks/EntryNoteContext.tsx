import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { toast } from "sonner";

import {
  inventoryService,
  type ItemResponse,
} from "../../../services/inventory/inventory.service";
import {
  suppliersService,
  type SupplierResponse,
} from "../../../services/suppliers/suppliers.service";

// ==================== TIPAGENS ====================
export interface IcmsRow {
  alicota: number;
  base: number;
  valor: number;
}
export interface EntryNoteItem {
  id: string;
  codigoProduto: string;
  nome: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
  valorIpi: number;
  valorIcms: number;
  cfop?: string;
}

export interface EntryNoteSupplier {
  id?: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  ie?: string;
  cidade?: string;
  uf?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cep?: string;
}

export interface EntryNoteTransport {
  nome: string;
  cnpj: string;
  placa: string;
  uf: string;
  transportadora?: string;
  fretePorConta?: "NONE" | "EMITENTE" | "DESTINATARIO";
  pesoBruto?: number;
  pesoLiquido?: number;
  volume?: number;
}

export interface EntryNoteForm {
  id?: string;
  numero: string;
  serie: string;
  modelo: string;
  cfop: string;
  chaveNfe: string;
  dataEmissao: string;
  dataEntrada: string;
  frete: number;
  seguro: number;
  outrasDespesas: number;
  descontos: number;
  icmsRetido: number;
  supplier: EntryNoteSupplier;
  transport: EntryNoteTransport;
  items: EntryNoteItem[];
  icmsRows: IcmsRow[];
}

export interface EntryNoteTotals {
  totalProdutos: number;
  totalNota: number;
  valorIpi: number;
  valorIcms: number;
  baseIcms: number;
  baseIcmsSt?: number;
  valorIcmsSt?: number;
}

interface EntryNoteContextValue {
  form: EntryNoteForm;
  totals: EntryNoteTotals;
  isSaving: boolean;
  isLoadingData: boolean;

  availableItems: ItemResponse[];
  availableSuppliers: SupplierResponse[];

  isCreateItemOpen: boolean;
  divergences: string[];
  importedFields: Record<string, boolean>;

  // Actions
  patch: (data: Partial<EntryNoteForm>) => void;
  patchSupplier: (data: Partial<EntryNoteSupplier>) => void;
  patchTransport: (data: Partial<EntryNoteTransport>) => void;

  addItem: (item?: Partial<EntryNoteItem>) => void;
  updateItem: (index: number, data: Partial<EntryNoteItem>) => void;
  removeItem: (index: number) => void;

  openCreateItemSheet: () => void;
  closeCreateItemSheet: () => void;
  importXml: () => void;

  save: () => Promise<boolean>;
  reset: () => void;
}

// ==================== CONTEXT ====================

const EntryNoteContext = createContext<EntryNoteContextValue | null>(null);

export function EntryNoteProvider({
  children,
  initialData,
}: PropsWithChildren<{ initialData?: any }>) {
  const [form, setForm] = useState<EntryNoteForm>(() => buildInitialForm(initialData));
  const [totals, setTotals] = useState<EntryNoteTotals>(() => buildInitialTotals());

  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);

  const [availableItems, setAvailableItems] = useState<ItemResponse[]>([]);
  const [availableSuppliers, setAvailableSuppliers] = useState<SupplierResponse[]>([]);

  const [divergences, setDivergences] = useState<string[]>([]);
  const [importedFields, setImportedFields] = useState<Record<string, boolean>>({});

  // ==================== INITIAL STATE ====================

  function buildInitialForm(initialData?: any): EntryNoteForm {
    return {
      numero: initialData?.numero || initialData?.documentRef || "",
      modelo: initialData?.modelo || "55",
      serie: initialData?.serie || "1",
      chaveNfe: initialData?.chaveNfe || "",
      cfop: initialData?.cfop || "",
      dataEmissao: initialData?.dataEmissao || new Date().toISOString().split("T")[0],
      dataEntrada: initialData?.dataEntrada || new Date().toISOString().split("T")[0],
      frete: Number(initialData?.frete) || 0,
      seguro: Number(initialData?.seguro) || 0,
      outrasDespesas: Number(initialData?.outrasDespesas) || 0,
      descontos: Number(initialData?.descontos) || 0,
      icmsRetido: Number(initialData?.icmsRetido) || 0,
      supplier: {
        id: initialData?.supplier?.id,
        cnpj: initialData?.supplier?.cnpj || "",
        razaoSocial: initialData?.supplier?.razaoSocial || "",
        nomeFantasia: initialData?.supplier?.nomeFantasia || "",
        ie: initialData?.supplier?.ie || "",
        cidade: initialData?.supplier?.cidade || "",
        uf: initialData?.supplier?.uf || "",
        rua: initialData?.supplier?.rua || "",
        numero: initialData?.supplier?.numero || "",
        bairro: initialData?.supplier?.bairro || "",
        cep: initialData?.supplier?.cep || "",
      },
      transport: initialData?.transport || {
        nome: "",
        cnpj: "",
        placa: "",
        uf: "",
        fretePorConta: "NONE",
      },
      items: initialData?.items?.map((it: any) => ({
        id: it.id || crypto.randomUUID(),
        codigoProduto: it.codigoProduto || "",
        nome: it.nome || it.nomeOriginal || "",
        quantidade: Number(it.quantidade || 1),
        unidade: it.unidade || "UN",
        valorUnitario: Number(it.valorUnitario || 0),
        valorIpi: Number(it.valorIpi || 0),
        valorIcms: Number(it.valorIcms || 0),
      })) || [],
      icmsRows: initialData?.icmsRows || [
        { alicota: 0, base: 0, valor: 0 },
        { alicota: 0, base: 0, valor: 0 },
        { alicota: 0, base: 0, valor: 0 },
      ],
    };
  }

  function buildInitialTotals(): EntryNoteTotals {
    return {
      totalProdutos: 0,
      totalNota: 0,
      valorIpi: 0,
      valorIcms: 0,
      baseIcms: 0,
      valorIcmsSt: 0,
    };
  }

  // ==================== LOAD LOOKUPS ====================

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        const [itemsRes, suppliersRes] = await Promise.all([
          inventoryService.getItems(),
          suppliersService.getSuppliers(),
        ]);

        setAvailableItems(itemsRes);
        setAvailableSuppliers(suppliersRes);
      } catch (error) {
        console.error("Erro ao carregar dados auxiliares:", error);
        toast.error("Não foi possível carregar itens ou fornecedores.");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  // ==================== CÁLCULO DE TOTAIS ====================

  const calculateTotals = useCallback((currentForm: EntryNoteForm) => {
    const totalProdutos = currentForm.items.reduce(
      (acc, item) => acc + Number(item.quantidade) * Number(item.valorUnitario),
      0
    );

    const valorIpi = currentForm.items.reduce((acc, item) => acc + Number(item.valorIpi || 0), 0);
    const valorIcms = currentForm.items.reduce((acc, item) => acc + Number(item.valorIcms || 0), 0);

    const totalNota =
      totalProdutos +
      currentForm.frete +
      currentForm.seguro +
      currentForm.outrasDespesas +
      currentForm.icmsRetido +
      valorIpi -
      currentForm.descontos;

    setTotals({
      totalProdutos: Number(totalProdutos.toFixed(2)),
      totalNota: Number(totalNota.toFixed(2)),
      valorIpi: Number(valorIpi.toFixed(2)),
      valorIcms: Number(valorIcms.toFixed(2)),
      baseIcms: Number(totalProdutos.toFixed(2)),
      valorIcmsSt: Number(currentForm.icmsRetido.toFixed(2)),
    });
  }, []);

  useEffect(() => {
    calculateTotals(form);
  }, [form, calculateTotals]);

  // ==================== ACTIONS ====================

  const patch = useCallback((data: Partial<EntryNoteForm>) => {
    setForm((prev) => {
      const updated = { ...prev, ...data };
      calculateTotals(updated);
      return updated;
    });
  }, [calculateTotals]);

  const patchSupplier = useCallback((data: Partial<EntryNoteSupplier>) => {
    setForm((prev) => ({
      ...prev,
      supplier: { ...prev.supplier, ...data },
    }));
  }, []);

  const patchTransport = useCallback((data: Partial<EntryNoteTransport>) => {
    setForm((prev) => ({
      ...prev,
      transport: { ...prev.transport, ...data },
    }));
  }, []);

  const addItem = useCallback((item?: Partial<EntryNoteItem>) => {
    const newItem: EntryNoteItem = {
      id: crypto.randomUUID(),
      codigoProduto: item?.codigoProduto || "",
      nome: item?.nome || "",
      quantidade: item?.quantidade || 1,
      unidade: item?.unidade || "UN",
      valorUnitario: item?.valorUnitario || 0,
      valorIpi: item?.valorIpi || 0,
      valorIcms: item?.valorIcms || 0,
    };

    setForm((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  }, []);

  const updateItem = useCallback((index: number, data: Partial<EntryNoteItem>) => {
    setForm((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], ...data };
      return { ...prev, items: newItems };
    });
  }, []);

  const removeItem = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  const openCreateItemSheet = useCallback(() => setIsCreateItemOpen(true), []);
  const closeCreateItemSheet = useCallback(() => setIsCreateItemOpen(false), []);

  const importXml = useCallback(() => {
    // Sua implementação atual de XML (pode ser melhorada depois)
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xml";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const xmlText = event.target?.result as string;
          const xml = new DOMParser().parseFromString(xmlText, "application/xml");

          const xmlData: Partial<EntryNoteForm> = {
            numero: xml.getElementsByTagName("nNF")[0]?.textContent?.trim() || "",
            serie: xml.getElementsByTagName("serie")[0]?.textContent?.trim() || "",
            chaveNfe: xml.querySelector("infNFe")?.getAttribute("Id")?.replace("NFe", "") || "",
            dataEmissao: xml.getElementsByTagName("dhEmi")[0]?.textContent?.split("T")[0] || "",
            supplier: {
              razaoSocial: xml.getElementsByTagName("xNome")[0]?.textContent?.trim() || "",
              cnpj: xml.getElementsByTagName("CNPJ")[0]?.textContent?.trim() || "",
            },
          };

          patch(xmlData);
          setImportedFields({
            numero: true,
            serie: true,
            chaveNfe: true,
            dataEmissao: true,
            "supplier.razaoSocial": true,
            "supplier.cnpj": true,
          });
          toast.success("XML importado com sucesso!");
        } catch (err) {
          toast.error("Erro ao processar XML.");
          console.error(err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [patch]);

  const save = async (): Promise<boolean> => {
    if (!form.numero) {
      toast.error("O número da nota é obrigatório.");
      return false;
    }
    if (!form.supplier?.cnpj) {
      toast.error("Dados do fornecedor (CNPJ) estão incompletos.");
      return false;
    }
    if (form.items.length === 0) {
      toast.error("Adicione pelo menos um item à nota.");
      return false;
    }

    setIsSaving(true);
    try {
      console.log("Salvando nota de entrada:", { form, totals });
      // await inventoryService.saveEntryNote(form, totals);

      toast.success("Nota fiscal de entrada lançada com sucesso!");
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao salvar nota.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const reset = useCallback(() => {
    setForm(buildInitialForm());
    setTotals(buildInitialTotals());
    setDivergences([]);
    setImportedFields({});
  }, []);

  const value: EntryNoteContextValue = {
    form,
    totals,
    isSaving,
    isLoadingData,
    availableItems,
    availableSuppliers,
    isCreateItemOpen,
    divergences,
    importedFields,

    patch,
    patchSupplier,
    patchTransport,
    addItem,
    updateItem,
    removeItem,
    openCreateItemSheet,
    closeCreateItemSheet,
    importXml,
    save,
    reset,
  };

  return (
    <EntryNoteContext.Provider value={value}>
      {children}
    </EntryNoteContext.Provider>
  );
}

export function useEntryNote() {
  const context = useContext(EntryNoteContext);
  if (!context) {
    throw new Error("useEntryNote must be used within an EntryNoteProvider");
  }
  return context;
}
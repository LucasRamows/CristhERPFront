import {
  FileText,
  History,
  LayoutGrid
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingComponent from "../../components/shared/LoadingComponent";
import {
  PageTabNavigation,
  type TabItem,
} from "../../components/shared/PageTabNavigation";
import {
  inventoryService,
  type IngredientResponse
} from "../../services/inventory/inventory.service";
import InventoryEntryPage from "../components/inventory/EntryPage";
import { InventorySuggestions } from "../components/inventory/InventorySuggestions";
import { InventoryTable } from "../components/inventory/InventoryTable";
import { SmartQuote } from "../components/inventory/SmartQuote";
import { XmlImport } from "../components/inventory/XmlImport";

// --- DADOS MOCKADOS ---

const MOCK_COTACAO = [
  {
    id: 1,
    insumo: "Filé Mignon (kg)",
    qtdSugestao: 25,
    fornecedores: { A: 68.9, B: 65.5, C: 70.0 },
  },
  {
    id: 2,
    insumo: "Salmão Fresco (kg)",
    qtdSugestao: 15,
    fornecedores: { A: 85.0, B: 89.9, C: 82.5 },
  },
  {
    id: 3,
    insumo: "Cerveja Artesanal (Lata)",
    qtdSugestao: 100,
    fornecedores: { A: 8.5, B: 8.5, C: 8.2 },
  },
];

export default function SupplyManagementPage() {
  const [activeView, setActiveView] = useState("estoque");
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [xmlState, setXmlState] = useState<"idle" | "uploading" | "success">("idle");

  const fetchIngredients = async () => {
    try {
      setIsLoading(true);
      const data = await inventoryService.getIngredients();
      setIngredients(data);
    } catch (error) {
      console.error("Erro ao buscar insumos:", error);
      toast.error("Não foi possível carregar os insumos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleFileUpload = () => {
    setXmlState("uploading");
    setTimeout(() => {
      setXmlState("success");
    }, 1500);
  };

  const inventoryTabs: TabItem[] = [
    { id: "estoque", label: "Gestão de Estoque", icon: LayoutGrid },
    // { id: "sugestoes", label: "Sugestões Compra", icon: ShoppingCart },
    // { id: "cotacao", label: "Cotação Inteligente", icon: Calculator },
    // { id: "xml", label: "Entrada XML", icon: UploadCloud },
    { id: "manual_entry", label: "Entrada Manual", icon: FileText },
    { id: "history", label: "Histórico", icon: History },
  ];

  return (
    <div className="flex gap-4 h-full flex-col w-full bg-background overflow-hidden select-none animate-in fade-in duration-700">
      {/* Toggle Switch Navigation */}
      <PageTabNavigation
        tabs={inventoryTabs}
        activeTab={activeView}
        onTabChange={setActiveView}
        className="w-full md:w-fit"
      />

      {isLoading && <LoadingComponent />}
      
      {/* WRAPPER PRINCIPAL */}
      <div className="flex flex-col h-full w-full overflow-hidden bg-card rounded-2xl">
        {/* ÁREA DE CONTEÚDO DINÂMICO */}
        <div className="flex-1 overflow-y-auto bg-card relative custom-scrollbar">
          
          {/* VISÃO 1: ESTOQUE (NOVA) */}
          {activeView === "estoque" && !isLoading && (
            <InventoryTable items={ingredients} />
          )}

          {/* VISÃO 2: SUGESTÃO DE COMPRAS */}
          {activeView === "sugestoes" && !isLoading && (
            <InventorySuggestions 
              items={ingredients} 
              onGenerateQuote={() => setActiveView("cotacao")}
            />
          )}

          {/* VISÃO 3: COTAÇÃO INTELIGENTE */}
          {activeView === "cotacao" && (
            <SmartQuote 
              items={MOCK_COTACAO} 
              onGenerateOrders={() => {
                toast.success("Pedidos de compra gerados com sucesso!");
                setActiveView("estoque");
              }}
            />
          )}

          {/* VISÃO 4: ENTRADA DE XML */}
          {activeView === "xml" && (
            <XmlImport 
              xmlState={xmlState}
              onFileUpload={handleFileUpload}
              onCancel={() => setXmlState("idle")}
              onConfirm={() => {
                toast.success("Nota fiscal confirmada e estoque atualizado!");
                setXmlState("idle");
                setActiveView("estoque");
              }}
            />
          )}

          {/* VISÃO 5: ENTRADA MANUAL */}
          {activeView === "manual_entry" && (
            <InventoryEntryPage />
          )}
        </div>
      </div>
    </div>
  );
}

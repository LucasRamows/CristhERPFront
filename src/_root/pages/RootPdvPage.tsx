import { Plus } from "lucide-react";
import { useState } from "react";
import { PdvAddComandaSheet } from "../components/pdv/PdvAddComandaSheet";
import { PdvComandas } from "../components/pdv/PdvComandas";
import { PdvHistorySheet } from "../components/pdv/PdvHistorySheet";
import { PdvMenu } from "../components/pdv/PdvMenu";
import { PdvPaymentModal } from "../components/pdv/PdvPaymentModal";
import { PdvProductModal } from "../components/pdv/PdvProductModal";
import { PdvTables } from "../components/pdv/PdvTables";
import { PdvTicketSheet } from "../components/pdv/PdvTicketSheet";
import { PdvWeightModal } from "../components/pdv/PdvWeightModal";

import { useEffect, useMemo } from "react";
import LoadingComponent from "../../components/shared/LoadingComponent";
import {
  PageTabNavigation,
  type TabItem,
} from "../../components/shared/PageTabNavigation";
import {
  SearhListPicker,
  StatusLegend,
} from "../../components/shared/SearhListPicker";
import { Button } from "../../components/ui/button";
import { useAuthenticatedUser } from "../../contexts/DataContext";
import { usePdvActions } from "../../hooks/use-pdv-actions";
import { usePdvData } from "../../hooks/use-pdv-data";
import { isDeepEqual } from "../../lib/utils";
import { calcPdvTotals } from "../../services/math/pdv.service";
import {
  ordersService,
  type OpenOrdersResponse,
} from "../../services/orders/orders.service";
import type { ProductsResponse } from "../../services/products/products.service";
import type { Category } from "../../components/shared/CategoryFilter";
import { PdvSplitModal } from "../components/pdv/pdvSplitModal";
import type { PdvEntity } from "../types/PdvEntity";

const pdvTabs: TabItem[] = [
  { id: "mesas", label: "Mesas (Salão)" },
  { id: "comandas", label: "Comandas" },
  { id: "caixa_rapido", label: "Caixa Rápido" },
];

export default function RootPdvPage() {
  const { data: user } = useAuthenticatedUser();
  const [activeView, setActiveView] = useState("mesas");
  const [activeEntity, setActiveEntity] = useState<PdvEntity | null>(null);
  const [categories] = useState<Category[]>(
    user?.restaurant?.ProductCategories || [],
  );

  const [openOrders, setOpenOrders] = useState<OpenOrdersResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [, setAllProducts] = useState<ProductsResponse[]>([]);
  const [includeService, setIncludeService] = useState(true);
  const [activeModalProduct, setActiveModalProduct] =
    useState<CartEditingItem | null>(null);

  const [orders, setOrders] = useState<Record<string, any[]>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("@CristhERP:draft_orders");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  interface CartEditingItem extends ProductsResponse {
    obs: string[];
    quantity: number;
  }
  useEffect(() => {
    localStorage.setItem("@CristhERP:draft_orders", JSON.stringify(orders));
  }, [orders]);
  // Estados de Modais
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSplitOpen, setIsSplitOpen] = useState(false);
  const [cartMobileOpen, setCartMobileOpen] = useState(false);
  const [isAddComandaOpen, setIsAddComandaOpen] = useState(false);
  const totalTables = Number(user?.restaurant?.totalTables) || 0;
  const { tables, comandas } = usePdvData(totalTables, openOrders);
  // --- BUSCA DE DADOS ---
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await ordersService.openOrders();
      setOpenOrders(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos abertos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (
      !activeEntity ||
      !activeEntity.id ||
      String(activeEntity.id).startsWith("temp_")
    )
      return;

    const allEntities = [...tables, ...comandas];

    const updated = allEntities.find(
      (e) =>
        (activeEntity.id && e.id === activeEntity.id) ||
        (e.reference === activeEntity.reference &&
          e.orderType === activeEntity.orderType),
    );

    if (updated && !isDeepEqual(updated, activeEntity)) {
      setActiveEntity(updated);
    }
  }, [openOrders, tables, comandas, activeEntity]);

  const actions = usePdvActions(
    activeEntity,
    setActiveEntity,
    setOrders,
    setOpenOrders,
    setIsSyncing,
    setActiveView,
    setCartMobileOpen,
    fetchOrders,
    comandas,
    user?.id || "",
  );

  const cart = useMemo(() => {
    if (!activeEntity) return [];

    const isScaleNote = (notes: string[]) =>
      notes?.some((n) => /kg$/i.test(n.trim()));
    const sourceItems = activeEntity.id
      ? openOrders.find((o) => o.id === activeEntity.id)?.items ?? []
      : activeEntity.items ?? [];

    const backendItems = sourceItems.map((item: any) => ({
      id: item.productId,
      uniqueId: item.id,
      name: item.product?.name || "Produto",
      price: parseFloat(item.unitPrice),
      quantity: item.quantity,
      obs: item.notes || [],
      isFromBackend: true,
      isScale: isScaleNote(item.notes || []),
    }));

    // Itens locais ainda não confirmados no backend
    const localItems = (orders[activeEntity.id] || []).map((item: any) => ({
      ...item,
      isScale: isScaleNote(item.obs || []),
    }));

    return [...backendItems, ...localItems];
  }, [activeEntity, orders, openOrders]);

  const { subtotal, serviceTax, total } = calcPdvTotals(
    cart,
    includeService,
    activeEntity?.orderType === "COUNTER",
  );

  // --- RENDERIZADORES AUXILIARES ---
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "available":
        return "bg-wte border-gray-200 text-gray-700 hover:border-gray-300";
      case "open":
        return "bg-[#E2F898] border-[#E2F898] text-gray-900 shadow-sm";
      case "awaiting":
        return "bg-[#FACC15] border-[#FACC15] text-gray-900 shadow-sm";
      case "closing":
      case "paid":
      case "canceled":
        return "bg-[#44A08D] border-[#44A08D] text-white shadow-sm";
      default:
        return "bg-white";
    }
  };
  const renderEntityItem = (entity: any) => (
    <div className="flex items-center gap-3 py-1">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${getStatusClasses(
          entity.status,
        )}`}
      >
        <span className="text-xs font-black">{entity.reference}</span>
      </div>
      <div>
        <h4 className="text-sm font-bold text-zinc-800">{entity.name}</h4>
        <p className="text-[11px] text-zinc-500 font-medium uppercase">
          {entity.status === "available" ? "Livre" : entity.status}
          {entity.total > 0 && ` • R$ ${entity.total.toFixed(2)}`}
        </p>
      </div>
    </div>
  );
  return (
    <div className="flex gap-4 flex-col w-full bg-background overflow-hidden select-none">
      <div className="flex h-12 md:min-h-14 w-full items-center justify-between overflow-hidden">
        <PageTabNavigation
          tabs={pdvTabs}
          activeTab={
            activeView === "menu" &&
            (activeEntity?.id === "caixa_balcao" ||
              activeEntity?.orderType === "COUNTER")
              ? "caixa_rapido"
              : activeView
          }
          onTabChange={(id) => {
            if (id === "caixa_rapido") {
              actions.handleCaixaRapido();
            } else {
              setActiveView(id);
            }
          }}
          className="bg-muted"
        />
        <PdvHistorySheet
          orders={openOrders}
          onOrderSelect={actions.handleEntityClick}
          onRefresh={fetchOrders}
        />
      </div>
      <div className="flex h-full w-full overflow-hidden bg-card rounded-2xl">
        <div className="flex-1 flex flex-col h-full">
          {/* ÁREA DE CONTEÚDO DINÂMICO (Scrollável) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            {isLoading ? (
              <LoadingComponent />
            ) : (
              <>
                {activeView === "mesas" && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="w-full">
                        <SearhListPicker
                          items={tables}
                          onSelect={actions.handleEntityClick}
                          placeholder="Buscar mesa pelo número..."
                          searchKeys={["name", "reference", "label"]}
                          renderItem={renderEntityItem}
                        />
                      </div>
                      <StatusLegend />
                    </div>
                    <PdvTables
                      entities={tables}
                      activeEntityId={activeEntity?.id}
                      onEntityClick={actions.handleEntityClick}
                      getStatusClasses={getStatusClasses}
                    />
                  </div>
                )}

                {/* VISÃO: COMANDAS */}
                {activeView === "comandas" && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="w-full min-w-[250px] flex gap-2 items-center">
                        <Button
                          variant="secondary"
                          onClick={() => setIsAddComandaOpen(true)}
                          className="shrink-0 h-[46px] w-[46px] p-0 flex items-center justify-center rounded-[14px]"
                        >
                          <Plus size={22} />
                        </Button>
                        <div className="flex-1">
                          <SearhListPicker
                            items={comandas}
                            onSelect={actions.handleEntityClick}
                            placeholder="Buscar comanda..."
                            searchKeys={["name", "reference", "label"]}
                            renderItem={renderEntityItem} // Usando a função extraída
                          />
                        </div>
                      </div>
                      <StatusLegend /> {/* Usando a legenda extraída */}
                    </div>
                    <PdvComandas
                      entities={comandas}
                      activeEntityId={activeEntity?.id}
                      onEntityClick={actions.handleEntityClick}
                      getStatusClasses={getStatusClasses}
                    />
                  </div>
                )}
              </>
            )}

            {activeView === "menu" && (
              <PdvMenu
                activeEntity={activeEntity as any}
                setActiveView={setActiveView}
                categories={categories}
                setAllProducts={setAllProducts}
                onProductClick={(item) =>
                  setActiveModalProduct({
                    ...item,
                    quantity: 1,
                    obs: [],
                  })
                }
              />
            )}
          </div>
        </div>

        <PdvTicketSheet
          isOpen={cartMobileOpen}
          onOpenChange={setCartMobileOpen}
          activeEntity={activeEntity as any}
          cart={cart as any}
          onCloseEntity={(entity) => {
            setActiveEntity(null);
            setActiveView(entity?.orderType === "CARD" ? "comandas" : "mesas");
          }}
          addClick={actions.handleAddClick}
          updateQuantity={actions.updateQuantity}
          includeService={includeService}
          setIncludeService={setIncludeService}
          serviceTax={serviceTax}
          total={total}
          onSplit={() => {
            setIsSplitOpen(true);
            setCartMobileOpen(false);
          }}
          onPayment={() => setIsPaymentOpen(true)}
          isSyncing={isSyncing}
        />
      </div>
      {/* MODAL: Observações e Quantidade Simples */}
      {activeModalProduct && activeModalProduct.unit.toUpperCase() !== "KG" && (
        <PdvProductModal
          product={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
          onConfirm={(prod, options) => {
            actions.confirmAddToCart(prod, options);
            setActiveModalProduct(null);
            setCartMobileOpen(true);
          }}
          activeEntity={activeEntity}
        />
      )}

      {/* MODAL: Produto por Peso (Balança) */}
      {activeModalProduct && activeModalProduct.unit.toUpperCase() === "KG" && (
        <PdvWeightModal
          product={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
          onConfirm={(prod, options) => {
            actions.confirmAddToCart(prod, options);
            setActiveModalProduct(null);
            setCartMobileOpen(true);
          }}
          activeEntity={activeEntity}
        />
      )}
      {/* MODAL 2: Pagamento Rápido */}
      <PdvPaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        subtotal={subtotal}
        serviceTax={serviceTax}
        total={total}
        onConfirm={actions.handleConfirmPayment}
      />

      {/* MODAL 3: Split (Divisão) */}
      {isSplitOpen && (
        <PdvSplitModal
          isOpen={isSplitOpen}
          onClose={() => setIsSplitOpen(false)}
          total={total}
          onProceed={() => {
            setIsSplitOpen(false);
            setIsPaymentOpen(true);
          }}
        />
      )}

      <PdvAddComandaSheet
        isOpen={isAddComandaOpen}
        onOpenChange={setIsAddComandaOpen}
        onConfirm={actions.handleCreateComanda}
      />
    </div>
  );
}

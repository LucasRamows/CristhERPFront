import { Plus, X } from "lucide-react";
import { useState } from "react";
import { PdvHistorySheet } from "../components/pdv/PdvHistorySheet";
import { PdvAddComandaSheet } from "../components/pdv/PdvAddComandaSheet";
import { PdvComandas } from "../components/pdv/PdvComandas";
import { PdvMenu } from "../components/pdv/PdvMenu";
import { PdvPaymentModal } from "../components/pdv/PdvPaymentModal";
import { PdvProductModal } from "../components/pdv/PdvProductModal";
import { PdvTables } from "../components/pdv/PdvTables";
import { PdvTicketSheet } from "../components/pdv/PdvTicketSheet";
import { PdvWeightModal } from "../components/pdv/PdvWeightModal";

import { useEffect, useMemo } from "react";
import LoadingComponent from "../../components/shared/LoadingComponent";
import { SearhListPicker } from "../../components/shared/SearhListPicker";
import { Button } from "../../components/ui/button";
import { useAuthenticatedUser } from "../../contexts/DataContext";
import {
  ordersService,
  type OpenOrdersResponse,
} from "../../services/orders/orders.service";
import type {
  ProductsResponse,
  SelectedProductForObs,
} from "../../services/products/products.service";
import { MENU_CATEGORIES_FOR_PDV } from "../constants/menuCategories";
import { calcPdvTotals } from "../../services/math/pdv.service";

export interface PdvEntity {
  id: string;
  orderType: "TABLE" | "CARD" | "COUNTER" | "DELIVERY";
  name: string;
  reference: string;
  label: string;
  status: "available" | "open" | "awaiting" | "closing" | "paid" | "canceled";
  total: number;
  orderId?: string;
  items?: any[];
  openedAt?: string;
}

export default function RootPdvPage() {
  const { data: user } = useAuthenticatedUser();
  const [activeView, setActiveView] = useState("mesas");
  const [activeEntity, setActiveEntity] = useState<PdvEntity | null>(null);

  // Estados Base
  const [openOrders, setOpenOrders] = useState<OpenOrdersResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Carrinho e Pedidos
  const [orders, setOrders] = useState<Record<string, any[]>>({});
  const [includeService, setIncludeService] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Estados de Modais
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSplitOpen, setIsSplitOpen] = useState(false);
  const [selectedProductForObs, setSelectedProductForObs] =
    useState<SelectedProductForObs | null>(null);
  const [splitCount, setSplitCount] = useState(1);
  const [cartMobileOpen, setCartMobileOpen] = useState(false);
  const [isAddComandaOpen, setIsAddComandaOpen] = useState(false);
  const [selectedWeightProduct, setSelectedWeightProduct] =
    useState<SelectedProductForObs | null>(null);

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

  // --- GERAÇÃO DE ENTIDADES (MESAS DINÂMICAS) ---
  const tables: PdvEntity[] = useMemo(() => {
    const totalTables = user?.restaurant?.totalTables || 10;
    return Array.from({ length: totalTables }, (_, i) => {
      const mesaNum = (i + 1).toString();
      const order = openOrders.find(
        (o) => o.orderType === "TABLE" && o.reference === mesaNum,
      );

      return {
        id: order?.id || `mesa_${mesaNum}`,
        orderType: "TABLE",
        name: `Mesa ${mesaNum}`,
        reference: mesaNum,
        label: `Mesa ${mesaNum}`,
        status: order ? (order.status.toLowerCase() as any) : "available",
        total: order ? parseFloat(order.total) : 0,
        openedAt: order?.openedAt,
        orderId: order?.id,
        items: order?.items || [],
      };
    });
  }, [user?.restaurant?.totalTables, openOrders]);

  const comandas: PdvEntity[] = useMemo(() => {
    return openOrders
      .filter((o) => o.orderType === "CARD")
      .map((order) => ({
        id: order.id,
        orderType: "CARD",
        name: `Comanda ${order.reference}`,
        reference: order.reference,
        label: `Cmd ${order.reference}`,
        status: order.status.toLowerCase() as any,
        total: parseFloat(order.total),
        openedAt: order?.openedAt,
        orderId: order.id,
        items: order.items,
      }));
  }, [openOrders]);

  // Sincronizar activeEntity quando os pedidos mudam
  useEffect(() => {
    if (activeEntity) {
      const allEntities = [...tables, ...comandas];
      const updated = allEntities.find((e) => {
        if (activeEntity.orderId && e.orderId === activeEntity.orderId)
          return true;
        if (
          e.reference === activeEntity.reference &&
          e.orderType === activeEntity.orderType
        )
          return true;
        return false;
      });
      if (updated && JSON.stringify(updated) !== JSON.stringify(activeEntity)) {
        setActiveEntity(updated);
      }
    }
  }, [openOrders, tables, comandas]);

  // --- FUNÇÕES DE AÇÃO ---
  const handleEntityClick = (entity: PdvEntity) => {
    setActiveEntity(entity);
    if (!orders[entity.id]) {
      setOrders((prev) => ({ ...prev, [entity.id]: [] }));
    }
    setCartMobileOpen(true);
  };

  const handleAddClick = (entity: any) => {
    setActiveEntity(entity);
    if (!orders[entity.id]) {
      setOrders((prev) => ({ ...prev, [entity.id]: [] }));
    }
    setActiveView("menu");
    setCartMobileOpen(false);
  };

  const handleCaixaRapido = () => {
    const caixaVirtual: PdvEntity = {
      id: "caixa_balcao",
      name: "Caixa Rápido",
      orderType: "COUNTER",
      reference: "Balcão",
      label: "Caixa Rápido",
      status: "open",
      total: 0,
    };
    setActiveEntity(caixaVirtual);
    if (!orders[caixaVirtual.id]) {
      setOrders((prev) => ({ ...prev, [caixaVirtual.id]: [] }));
    }
    setActiveView("menu");
  };

  const handleNewComanda = () => {
    setIsAddComandaOpen(true);
  };

  const handleConfirmNewComanda = (reference: string) => {
    // Verificar se já existe uma comanda aberta com esse número
    const existing = comandas.find((c) => c.reference === reference);
    if (existing) {
      handleEntityClick(existing);
      return;
    }

    const newEntity: PdvEntity = {
      id: `new_card_${reference}`,
      orderType: "CARD",
      name: `Comanda ${reference}`,
      reference: reference,
      label: `Cmd ${reference}`,
      status: "available",
      total: 0,
    };
    setActiveEntity(newEntity);
    setActiveView("menu");
    setCartMobileOpen(false);
  };

  const handleOrderSelect = (order: any) => {
    if (!order) return;

    const entity: PdvEntity = {
      id: order.id,
      orderId: order.id,
      orderType: order.orderType,
      reference: order.reference,
      name:
        order.orderType === "TABLE"
          ? `Mesa ${order.reference}`
          : order.orderType === "CARD"
          ? `Comanda ${order.reference}`
          : "Venda Direta",
      label:
        order.orderType === "TABLE"
          ? `Mesa ${order.reference}`
          : order.orderType === "CARD"
          ? `Cmd ${order.reference}`
          : "Balcão",
      status: order.status,
      total: parseFloat(order.total),
      items: order.items,
      openedAt: order.openedAt,
    };

    setActiveEntity(entity);
    setCartMobileOpen(true);
  };

  // --- UTILITÁRIOS DE ESTADO ---
  const updateOrderInState = (updatedOrder: OpenOrdersResponse) => {
    console.log("updateOrderInState", updatedOrder);
    setOpenOrders((prev) => {
      const exists = prev.find((o) => o.id === updatedOrder.id);
      if (exists) {
        return prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
      }
      return [...prev, updatedOrder];
    });
  };

  const removeOrderFromState = (orderId: string) => {
    setOpenOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const addToCart = (product: ProductsResponse) => {
    // Produtos de balança são identificados pelo campo unit === "kg"
    if (product.unit.toUpperCase() === "KG") {
      setSelectedWeightProduct({
        ...product,
        obs: [],
        quantity: 1,
      });
      return;
    }
    setSelectedProductForObs({
      ...product,
      obs: [],
      quantity: 1,
    });
  };

  const confirmAddToCart = async (item: SelectedProductForObs) => {
    if (!activeEntity) return;

    try {
      setIsSyncing(true);
      const createOrderItem = {
        productId: item.id,
        quantity: item.quantity,
        unitPrice: Number(item.price),
        notes: item.obs || [],
      };

      let response: OpenOrdersResponse;

      if (!activeEntity.orderId) {
        response = await ordersService.createOrder({
          orderType: activeEntity.orderType,
          reference: activeEntity.reference,
          operatorId: user?.id || "",
          total: Number(item.price) * item.quantity,
          items: [createOrderItem],
        });
      } else {
        response = await ordersService.addItemsToOrder(
          activeEntity.orderId,
          createOrderItem,
        );
      }
      setOpenOrders((prev) => {
        const otherOrders = prev.filter((o) => o.id !== response.id);
        return [...otherOrders, response];
      });

      setActiveEntity((prev: any) => ({
        ...prev,
        orderId: response.id,
        id: response.id,
        status: "open",
        total: parseFloat(response.total),
        items: response.items,
      }));
    } catch (error) {
      console.error("Erro ao processar pedido no backend:", error);
    } finally {
      setIsSyncing(false);
    }

    setSelectedProductForObs(null);
  };

  const updateQuantity = async (index: number, delta: number) => {
    if (!activeEntity) return;

    const item = cart[index];
    if (!item) return;

    setIsSyncing(true);
    if (item.isFromBackend) {
      try {
        const newQtd = Number(item.quantity) + delta;
        if (newQtd <= 0) {
          // uniqueId é o ID do item do pedido (não o productId)
          await ordersService.removeItem(item.uniqueId);
          await fetchOrders();
        } else {
          const response = await ordersService.updateItems(
            activeEntity.orderId!,
            [{ id: item.uniqueId, quantity: newQtd }],
          );
          updateOrderInState(response);
        }
      } catch (error) {
        console.error("Erro ao atualizar item no backend:", error);
      } finally {
        setIsSyncing(false);
      }
    } else {
      // Itens locais ainda não sincronizados com o backend
      try {
        setOrders((prev) => {
          // Os itens do backend vêm de openOrders (fonte de verdade),
          // então calculamos o índice local subtraindo os do backend
          const sourceOrder = openOrders.find(
            (o) => o.id === activeEntity.orderId,
          );
          const backendItemsCount = (
            sourceOrder?.items ||
            activeEntity.items ||
            []
          ).length;
          const localIndex = index - backendItemsCount;
          const currentLocalOrders = prev[activeEntity.id] || [];

          if (localIndex < 0 || !currentLocalOrders[localIndex]) return prev;

          const newOrders = [...currentLocalOrders];
          const localItem = newOrders[localIndex];
          const newQtd = localItem.quantity + delta;

          if (newQtd <= 0) {
            newOrders.splice(localIndex, 1);
          } else {
            newOrders[localIndex] = { ...localItem, quantity: newQtd };
          }
          return { ...prev, [activeEntity.id]: newOrders };
        });
      } finally {
        // Garante que o syncing seja resetado também para itens locais
        setIsSyncing(false);
      }
    }
  };

  const handleConfirmPayment = async (data: {
    method: string;
    amount: number;
    discount: number;
    customerId?: string;
  }) => {
    if (!activeEntity?.orderId) return;

    try {
      setIsSyncing(true);

      // Mapping 'Fiado' to the backend expected value 'STORE_CREDIT'
      const mappedMethod =
        data.method === "Fiado" ? "STORE_CREDIT" : data.method;

      // O backend já gerencia a criação do ledger se o método for STORE_CREDIT
      await ordersService.closeOrder(
        activeEntity.orderId,
        mappedMethod,
        data.customerId || "",
        data.amount,
      );

      // Limpa os estados e atualiza a UI
      removeOrderFromState(activeEntity.orderId);
      setActiveEntity(null);
      setIsPaymentOpen(false);
      setCartMobileOpen(false);
    } catch (error) {
      console.error("Erro ao finalizar pagamento:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // --- CARRINHO ATUAL ---
  // FONTE DE VERDADE: lê os itens diretamente de `openOrders` quando há orderId.
  // Assim, qualquer `updateOrderInState` reflete imediatamente aqui,
  // sem depender de um useEffect intermediário que pode não ser acionado.
  const cart = useMemo(() => {
    if (!activeEntity) return [];

    const isScaleNote = (notes: string[]) =>
      notes?.some((n) => /kg$/i.test(n.trim()));

    // Busca os itens direto de openOrders (atualizado por updateOrderInState)
    // Se não há orderId (ex: nova mesa ainda vazia), cai para activeEntity.items
    const sourceItems = activeEntity.orderId
      ? openOrders.find((o) => o.id === activeEntity.orderId)?.items ?? []
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
        return "bg-[#FFD1CD] border-[#FFD1CD] text-gray-900 shadow-sm";
      case "closing":
      case "paid":
      case "canceled":
        return "bg-[#44A08D] border-[#44A08D] text-white shadow-sm";
      default:
        return "bg-white";
    }
  };

  const baseButtonClasses =
    "inline-flex h-full items-center justify-center whitespace-nowrap rounded-full px-5 md:px-8 text-sm md:text-base font-bold transition-all";

  return (
    <div className="flex gap-4 flex-col w-full bg-background overflow-hidden select-none">
      <div className="flex h-12 md:h-14 w-full items-center justify-between overflow-hidden">
        <div className="flex h-full w-fit items-center justify-center rounded-full bg-gray-100 p-1 md:p-1.5 text-gray-500 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveView("mesas")}
            className={`${baseButtonClasses} ${
              activeView === "mesas"
                ? "bg-white text-gray-900"
                : "hover:text-gray-900"
            }`}
          >
            Mesas (Salão)
          </button>
          <button
            onClick={() => setActiveView("comandas")}
            className={`${baseButtonClasses} ${
              activeView === "comandas"
                ? "bg-white text-gray-900"
                : "hover:text-gray-900"
            }`}
          >
            Comandas
          </button>
          <button
            onClick={handleCaixaRapido}
            className={`${baseButtonClasses} ${
              activeView === "menu" && activeEntity?.id === "caixa_balcao"
                ? "bg-white text-gray-900"
                : "hover:text-gray-900"
            }`}
          >
            Caixa Rápido
          </button>
        </div>
        <PdvHistorySheet
          orders={openOrders}
          onOrderSelect={handleOrderSelect}
          onRefresh={fetchOrders}
        />
      </div>
      <div className="flex h-full w-full overflow-hidden bg-card rounded-2xl">
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* ÁREA DE CONTEÚDO DINÂMICO (Scrollável) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            {isLoading ? (
              <LoadingComponent />
            ) : (
              <>
                {activeView === "mesas" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                      <SearhListPicker
                        items={tables}
                        onSelect={handleEntityClick}
                        placeholder="Buscar mesa pelo número..."
                        searchKeys={["name", "reference", "label"]}
                        renderItem={(table) => (
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${getStatusClasses(
                                table.status,
                              )}`}
                            >
                              <span className="text-xs font-black">
                                {table.reference}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-zinc-800">
                                {table.name}
                              </h4>
                              <p className="text-[11px] text-zinc-500 font-medium uppercase">
                                {table.status === "available"
                                  ? "Livre"
                                  : table.status}
                                {table.total > 0 &&
                                  ` • R$ ${table.total.toFixed(2)}`}
                              </p>
                            </div>
                          </div>
                        )}
                      />
                      <div className="px-4 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between shrink-0">
                        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-bold text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300"></div>
                            Livre
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#E2F898]"></div>
                            Ocupada
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#FFD1CD]"></div>
                            Ag. Prato
                          </div>
                        </div>
                      </div>
                    </div>
                    <PdvTables
                      entities={tables}
                      activeEntityId={activeEntity?.id}
                      onEntityClick={handleEntityClick}
                      getStatusClasses={getStatusClasses}
                    />
                  </div>
                )}

                {/* VISÃO: COMANDAS */}
                {activeView === "comandas" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                      <div className="w-full flex gap-1 items-center justify-start">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleNewComanda}
                        >
                          <Plus className="h-full w-full" />
                        </Button>
                        <SearhListPicker
                          items={comandas}
                          onSelect={handleEntityClick}
                          placeholder="Buscar comanda pelo número..."
                          searchKeys={["name", "reference", "label"]}
                          renderItem={(cmd) => (
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${getStatusClasses(
                                  cmd.status,
                                )}`}
                              >
                                <span className="text-xs font-black">
                                  {cmd.reference}
                                </span>
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-zinc-800">
                                  {cmd.name}
                                </h4>
                                <p className="text-[11px] text-zinc-500 font-medium uppercase">
                                  {cmd.status}
                                  {cmd.total > 0 &&
                                    ` • R$ ${cmd.total.toFixed(2)}`}
                                </p>
                              </div>
                            </div>
                          )}
                        />
                      </div>
                      <div className="px-4 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between shrink-0">
                        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-bold text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300"></div>
                            Livre
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#E2F898]"></div>
                            Ocupada
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#FFD1CD]"></div>
                            Ag. Prato
                          </div>
                        </div>
                      </div>
                    </div>
                    <PdvComandas
                      entities={comandas}
                      activeEntityId={activeEntity?.id}
                      onEntityClick={handleEntityClick}
                      getStatusClasses={getStatusClasses}
                    />
                  </div>
                )}
              </>
            )}

            {/* VISÃO: MENU DE PRODUTOS */}
            {activeView === "menu" && (
              <PdvMenu
                activeEntity={activeEntity as any}
                setActiveView={setActiveView}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={MENU_CATEGORIES_FOR_PDV}
                addToCart={addToCart as any}
              />
            )}
          </div>
        </div>

        <PdvTicketSheet
          isOpen={cartMobileOpen}
          setActiveView={setActiveView}
          onOpenChange={setCartMobileOpen}
          activeEntity={activeEntity as any}
          cart={cart as any}
          onCloseEntity={() => setActiveEntity(null)}
          addClick={handleAddClick}
          updateQuantity={updateQuantity}
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

      <PdvProductModal
        product={selectedProductForObs}
        onClose={() => setSelectedProductForObs(null)}
        onConfirm={(prod) => {
          confirmAddToCart(prod);
          setCartMobileOpen(true);
        }}
      />

      {/* MODAL: Produto por Peso (Balança) */}
      <PdvWeightModal
        product={selectedWeightProduct}
        onClose={() => setSelectedWeightProduct(null)}
        onConfirm={(prod) => {
          setSelectedWeightProduct(null);
          confirmAddToCart(prod);
          setCartMobileOpen(true);
        }}
      />

      {/* MODAL 2: Pagamento Rápido */}
      <PdvPaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        subtotal={subtotal}
        serviceTax={serviceTax}
        total={total}
        onConfirm={handleConfirmPayment}
      />

      {/* MODAL 3: Split (Divisão) */}
      {isSplitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-sm p-8 flex flex-col shadow-2xl relative text-center">
            <button
              onClick={() => setIsSplitOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black mb-2 mt-4">Dividir Conta</h2>
            <p className="text-gray-500 font-medium mb-8">
              Total: R$ {total.toFixed(2)}
            </p>

            <div className="flex items-center justify-center gap-6 mb-8">
              <button
                onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                className="w-16 h-16 rounded-[20px] bg-gray-100 flex items-center justify-center text-3xl font-black"
              >
                -
              </button>
              <div className="text-4xl font-black w-16">{splitCount}</div>
              <button
                onClick={() => setSplitCount(splitCount + 1)}
                className="w-16 h-16 rounded-[20px] bg-gray-100 flex items-center justify-center text-3xl font-black"
              >
                +
              </button>
            </div>

            {splitCount > 1 && (
              <div className="bg-[#E2F898]/30 p-4 rounded-[20px] mb-8">
                <p className="text-gray-600 font-bold text-sm mb-1">
                  Valor por pessoa
                </p>
                <p className="text-3xl font-black text-gray-900">
                  R$ {(total / splitCount).toFixed(2)}
                </p>
              </div>
            )}

            <button
              onClick={() => {
                setIsSplitOpen(false);
                setIsPaymentOpen(true);
              }}
              className="w-full py-5 rounded-[20px] font-black text-xl bg-gray-900 text-white"
            >
              Ir para Pagamento
            </button>
          </div>
        </div>
      )}

      <PdvAddComandaSheet
        isOpen={isAddComandaOpen}
        onOpenChange={setIsAddComandaOpen}
        onConfirm={handleConfirmNewComanda}
      />
    </div>
  );
}

import { History, Info, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../../../components/ui/sheet";
import { formatTime } from "../../../lib/utils";
import type { OpenOrdersResponse } from "../../../services/orders/orders.service";
import { ordersService } from "../../../services/orders/orders.service";

interface PdvHistorySheetProps {
  orders: OpenOrdersResponse[];
  onOrderSelect: (orderId: string) => void;
  onRefresh: () => Promise<void>;
}

export function PdvHistorySheet({
  orders,
  onOrderSelect,
  onRefresh,
}: PdvHistorySheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState<string | null>(
    null,
  );

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Deseja realmente excluir este pedido?")) return;

    try {
      setIsDeleting(orderId);
      await ordersService.deleteOrder(orderId);
      await onRefresh();
      toast.success("Pedido excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
      toast.error("Erro ao excluir pedido");
    } finally {
      setIsDeleting(null);
    }
  };

  const unpaidOrders = orders.filter(
    (o) =>
      o.status.toLowerCase() !== "paid" &&
      o.status.toLowerCase() !== "canceled",
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full bg-gray-100 border-none text-gray-500 hover:text-gray-900 font-bold gap-2"
        >
          <History size={18} />
          HISTÓRICO
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-[450px] p-0 flex flex-col h-full bg-white outline-none [&>button]:hidden"
      >
        <SheetTitle className="sr-only">
          Histórico de Pedidos em Aberto
        </SheetTitle>

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">
              Gerenciamento
            </p>
            <h2 className="text-2xl font-black">Histórico em Aberto</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {unpaidOrders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
              <History size={48} className="opacity-20" />
              <p className="font-bold">Nenhum pedido em aberto</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {unpaidOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-50 rounded-[24px] border border-gray-100 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              order.orderType === "TABLE"
                                ? "bg-blue-100 text-blue-600"
                                : order.orderType === "CARD"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-orange-100 text-orange-600"
                            }`}
                          >
                            {order.orderType === "TABLE"
                              ? "Mesa"
                              : order.orderType === "CARD"
                              ? "Comanda"
                              : "Balcão"}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400">
                            {formatTime(order.openedAt)}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-gray-900">
                          {order.orderType === "TABLE"
                            ? `Mesa ${order.reference}`
                            : order.orderType === "CARD"
                            ? `Comanda ${order.reference}`
                            : "Venda Direta"}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase">
                          Total
                        </p>
                        <p className="text-xl font-black text-[#44A08D]">
                          R$ {parseFloat(order.total).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 rounded-xl font-bold gap-2 bg-white border border-gray-200"
                        onClick={() =>
                          setSelectedOrderItems(
                            order.id === selectedOrderItems ? null : order.id,
                          )
                        }
                      >
                        <Info size={16} />
                        Itens
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 rounded-xl font-bold gap-2 bg-[#E2F898] text-gray-900 hover:bg-[#d4e98a]"
                        onClick={() => {
                          onOrderSelect(order.id);
                          setIsOpen(false);
                        }}
                      >
                        <Pencil size={16} />
                        Alterar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-10 rounded-xl p-0 flex items-center justify-center bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white"
                        disabled={isDeleting === order.id}
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        {isDeleting === order.id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Order Items Details */}
                  {selectedOrderItems === order.id && (
                    <div className="bg-white border-t border-gray-100 p-5 animate-in slide-in-from-top-2 duration-200">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-3">
                        Itens do Pedido
                      </p>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-black text-gray-900">
                                {item.quantity}x
                              </span>
                              <span className="font-bold text-gray-600">
                                {item.product.name}
                              </span>
                            </div>
                            <span className="font-bold text-gray-400">
                              R$ {parseFloat(item.unitPrice).toFixed(2)}
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
      </SheetContent>
    </Sheet>
  );
}

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit2, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import type { ProductsResponse, ProductsStatsResponse } from "../../../services/products/products.service";
import { productsService } from "../../../services/products/products.service";

interface RootMenuItemOptionsProps {
  item: ProductsResponse;
  onClose: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}




export default function RootMenuItemOptions({
  item,
  onClose,
  onEditClick,
  onDeleteClick,
}: RootMenuItemOptionsProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [salesData, setSalesData] = useState<ProductsStatsResponse[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Busca de dados reais do banco para o gráfico
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const stats = await productsService.getProductStats(item.id);
        
        // Mapeamos para o formato que o gráfico espera
        const formattedData = stats.map(s => ({
          ...s,
          sales_date: format(new Date(s.sales_date), "dd/MM", { locale: ptBR }),
          total: Number(s.quantity)
        }));
        
        setSalesData(formattedData);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, [item.id]);

  const handleToggleStatus = async () => {
    try {
      setIsUpdatingStatus(true);
      const newStatus = !item.status;
      await productsService.updateProduct(item.id, { status: newStatus });

      // Atualizar o item localmente ou esperar o refresh do pai
      item.status = newStatus; // Mutação direta para feedback imediato (o pai deve atualizar também)
      toast.success(`Produto ${newStatus ? "ativado" : "pausado"} com sucesso`);
    } catch (error) {
      toast.error("Erro ao atualizar status do produto");
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
        <div>
          <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">
            {item.category}
          </p>
          <h2 className="text-2xl font-black leading-tight">{item.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-8">
        {/* Gráfico de Vendas */}
        <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Desempenho Mensal
              </p>
              <h4 className="text-lg font-black text-zinc-800">
                Vendas do Item
              </h4>
            </div>
            {!isLoadingStats && (
              <div className="bg-decoration px-3 py-1 rounded-full text-[10px] font-black text-zinc-900 uppercase">
                Em Tempo Real
              </div>
            )}
          </div>

          <div className="h-[120px] w-full flex items-center justify-center">
            {isLoadingStats ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase">
                  Calculando dados...
                </span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DCFF79" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#DCFF79" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="sales_date" hide />
                  <Tooltip
                    labelStyle={{ color: '#94a3b8' }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      fontSize: "12px",
                      fontWeight: "800",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="quantity"
                    stroke="#DCFF79"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Resumo do Produto */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-5 rounded-[24px] border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
              Preço Atual
            </p>
            <p className="text-xl font-black text-gray-900">
              R$ {Number(item.price).toFixed(2)}
            </p>
          </div>
          <button
            disabled={isUpdatingStatus}
            onClick={handleToggleStatus}
            className="bg-gray-50 p-5 rounded-[24px] border border-gray-100 flex flex-col justify-center text-left hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
              Status (Clique p/ alternar)
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  item.status
                    ? "bg-[#DCFF79] shadow-[0_0_10px_#DCFF79]"
                    : "bg-gray-300"
                }`}
              />
              <p className="text-base font-bold text-gray-900">
                {isUpdatingStatus ? "..." : item.status ? "Ativo" : "Pausado"}
              </p>
            </div>
          </button>
        </div>

        {/* Lista de Ações */}
        <div className="space-y-3">
          <button
            onClick={onEditClick}
            className="w-full flex items-center p-5 bg-white border border-gray-100 rounded-[24px] hover:border-gray-200 hover:bg-gray-50 transition-all group"
          >
            <div className="bg-gray-100 p-3 rounded-2xl group-hover:bg-[#DCFF79] transition-colors mr-4">
              <Edit2
                size={20}
                className="group-hover:text-zinc-900 transition-colors"
              />
            </div>
            <div className="text-left">
              <h4 className="font-black text-gray-800 leading-tight">
                Editar Dados
              </h4>
              <p className="text-[11px] text-gray-500 font-medium uppercase tracking-tight">
                Nome, preço, categoria e descrição
              </p>
            </div>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center p-5 bg-red-50/30 border border-red-100 rounded-[24px] hover:bg-red-50 transition-all group"
          >
            <div className="bg-red-100 p-3 rounded-2xl text-red-600 mr-4">
              <Trash2 size={20} />
            </div>
            <div className="text-left">
              <h4 className="font-black text-red-600 leading-tight">
                Excluir Permanente
              </h4>
              <p className="text-[11px] text-red-400 font-medium uppercase tracking-tight">
                Remover permanentemente do sistema
              </p>
            </div>
          </button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="rounded-[32px] border-none p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black">
              Você tem certeza?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-500 font-medium">
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              produto
              <span className="font-bold text-zinc-900"> {item.name} </span>
              do seu cardápio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-full font-bold border-zinc-200">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white rounded-full font-bold px-8 shadow-lg shadow-red-200"
              onClick={onDeleteClick}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

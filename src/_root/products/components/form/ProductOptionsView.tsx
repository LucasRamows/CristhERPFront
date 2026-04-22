import { Edit2, Loader2, Package, Trash2 } from "lucide-react";
import { useInventoryContext } from "../../hooks/new/InventoryContext";
import { useProductOptions } from "../../hooks/new/useProductOptions";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../components/ui/alert-dialog";
import { Badge } from "../../../../components/ui/badge";
import { ProductSalesChart } from "../shared/ProductSaleChart";
import { ProductSummary } from "../shared/ProductSummary";

// Removemos `item` e `isRetail` das Props!
interface OptionsViewProps {
  onEditClick: () => void;
}

export default function OptionsView({ onEditClick }: OptionsViewProps) {
  // Puxamos a flag do contexto
  const { isRetail } = useInventoryContext();

  // Puxamos todo o resto do Hook
  const {
    item,
    salesData,
    isLoadingStats,
    showDeleteConfirm,
    setShowDeleteConfirm,
    isDeleting,
    handleDeleteConfirm,
    status,
    isUpdatingStatus,
    toggleStatus, // <-- Adicionamos o toggleStatus aqui
  } = useProductOptions();

  // Proteção caso o item ainda não tenha carregado
  if (!item) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header com Imagem */}
      <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center opacity-20">
            <Package size={48} className="text-gray-400" />
            <span className="text-[10px] font-black uppercase tracking-widest mt-2">
              Sem Imagem
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-6">
          <div className="w-full">
            <p className="text-[#DCFF79] font-black uppercase tracking-widest text-[10px] mb-1">
              {item.category?.name || "Geral"}
            </p>
            <h2 className="text-2xl font-black text-white leading-tight">
              {item.name}
            </h2>
            <Badge className="bg-white/20 text-white font-black uppercase tracking-widest text-[10px] mb-1">
              {item.code}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-8">
        {/* Gráfico de Vendas */}
        <ProductSalesChart salesData={salesData} isLoading={isLoadingStats} />

        {/* Resumo */}
        <ProductSummary
          price={item.price}
          status={status}
          isUpdatingStatus={isUpdatingStatus}
          onToggleStatus={toggleStatus}
          // Lógica perfeita: Mostra o estoque se Varejo gerenciar estoque OR F&B for Produto Simples
          showStock={
            (isRetail && item.manageStock) ||
            (!isRetail && item.isSimpleProduct)
          }
          currentStock={Number(item.retailStock ?? item.productRecipes?.[0]?.item?.currentStock ?? 0)}
          minStock={Number(item.minStock ?? item.retailMinStock ?? item.productRecipes?.[0]?.item?.minStock ?? 0)}
          isLoadingStock={isLoadingStats}
        />

        {/* Ações */}
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
                Nome, preço, categoria e ingredientes
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
              item <span className="font-bold text-zinc-900">{item.name}</span>{" "}
              do seu cardápio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-full font-bold border-zinc-200">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white rounded-full font-bold px-8 shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
            >
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

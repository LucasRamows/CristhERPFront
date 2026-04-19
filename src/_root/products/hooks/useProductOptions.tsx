import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCallback, useEffect, useState } from "react";
import { useAlert } from "../../../components/shared/AlertProvider";
import { productsService } from "../../../services/products/products.service";
import type {
  ProductsResponse,
  ProductsStatsResponse,
} from "../../../services/products/products.types";
import { useInventoryContext } from "./InventoryContext";
import { useProductStatus } from "./useEditStatus";

export function useProductOptions() {
  const { showSuccess, clearAlert } = useAlert();
  const {
    selectedProduct: item,
    handleDeleteProduct,
    handleUpdateProductStatusInList,
    setIsEditProductOpen,
    setSelectedProduct,
  } = useInventoryContext();
  const [salesData, setSalesData] = useState<ProductsStatsResponse[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const safeItem = item ?? ({ id: "", status: false } as ProductsResponse);

  const { status, isUpdatingStatus, toggleStatus } = useProductStatus({
    item: safeItem,
    onSuccess: () => {
      if (item) {
        handleUpdateProductStatusInList();
      }
    },
  });

  useEffect(() => {
    if (!item) {
      setSalesData([]);
      setIsLoadingStats(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const stats = await productsService.getProductStats(item.id);
        const formattedData = stats.map((s) => ({
          ...s,
          sales_date: format(new Date(s.sales_date), "dd/MM", {
            locale: ptBR,
          }),
          total: Number(s.quantity),
        }));
        setSalesData(formattedData);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, [item]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!item) return;

    try {
      setIsDeleting(true);
      // Wait for the context to perform optimistic update + backend call
      await handleDeleteProduct();
      // If success, close everything
      setShowDeleteConfirm(false);
      setIsEditProductOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      // Rollback is handled by context, we just stop loading
      setShowDeleteConfirm(false);
    } finally {
      showSuccess("Produto excluído com sucesso!");
      setIsDeleting(false);
      setTimeout(() => {
        clearAlert();
      }, 3000);
    }
  }, [handleDeleteProduct, item, setIsEditProductOpen, setSelectedProduct]);

  return {
    salesData,
    isLoadingStats,
    showDeleteConfirm,
    setShowDeleteConfirm,
    isDeleting,
    handleDeleteConfirm,
    status,
    isUpdatingStatus,
    toggleStatus,
  };
}

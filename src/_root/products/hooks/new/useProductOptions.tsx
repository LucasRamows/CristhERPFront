import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCallback, useEffect, useState } from "react";
import { productsService } from "../../../../services/products/products.service";
import type { ProductsStatsResponse } from "../../../../services/products/products.types";
import { useInventoryContext } from "./InventoryContext";

export function useProductOptions() {
  const {
    activeProduct: item,
    setActiveProduct,
    deleteProductAction,
    toggleProductStatusAction,
  } = useInventoryContext();

  const [salesData, setSalesData] = useState<ProductsStatsResponse[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Busca as estatísticas do produto
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
          sales_date: format(new Date(s.sales_date), "dd/MM", { locale: ptBR }),
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

  // Nova ação de Deletar usando o Contexto
  const handleDeleteConfirm = useCallback(async () => {
    if (!item) return;

    try {
      setIsDeleting(true);
      await deleteProductAction(item);
      setShowDeleteConfirm(false);
      setActiveProduct(null); // Fecha a gaveta limpando o item!
    } catch (error) {
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }, [item, deleteProductAction, setActiveProduct]);

  // Nova ação de Status usando o Contexto
  const toggleStatus = useCallback(async () => {
    if (!item) return;
    try {
      setIsUpdatingStatus(true);
      await toggleProductStatusAction(item);
      setActiveProduct({ ...item, status: !item.status });
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [item, toggleProductStatusAction]);

  return {
    item,
    salesData,
    isLoadingStats,
    showDeleteConfirm,
    setShowDeleteConfirm,
    isDeleting,
    handleDeleteConfirm,
    status: item?.status ?? false,
    isUpdatingStatus,
    toggleStatus,
  };
}

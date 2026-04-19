import { useEffect, useState } from "react";
import { toast } from "sonner";
import { productsService } from "../../../services/products/products.service";
import type { ProductsResponse } from "../../../services/products/products.types";

interface UseProductStatusProps {
  item: ProductsResponse;
  // 👇 1. Criamos um callback para o hook "avisar" o componente pai
  onSuccess?: (newStatus: boolean) => void;
}

export function useProductStatus({ item, onSuccess }: UseProductStatusProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(item.status);

  useEffect(() => {
    setCurrentStatus(item.status);
  }, [item.status]);

  const toggleStatus = async () => {
    try {
      setIsUpdatingStatus(true);
      const newStatus = !currentStatus;

      await productsService.updateProductStatus(item.id);

      setCurrentStatus(newStatus);
      toast.success(
        `Produto ${newStatus ? "ativado" : "pausado"} com sucesso!`,
      );

      // 👇 2. Avisamos quem chamou o hook que deu certo
      if (onSuccess) {
        onSuccess(newStatus);
      }
    } catch (error) {
      toast.error("Erro ao atualizar o status do produto.");
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return {
    status: currentStatus,
    isUpdatingStatus,
    toggleStatus,
  };
}

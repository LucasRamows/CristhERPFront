// src/_features/inventory/hooks/useInventoryActions.ts
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { inventoryService, type CreateItemRequest, type ItemResponse } from "../../../../services/inventory/inventory.service";
import { productsService } from "../../../../services/products/products.service";
import type { ProductsResponse } from "../../../../services/products/products.types";
import type { MenuItemFormType } from "../../schemas/menuItemSchema";

interface InventoryActionsProps {
  setProducts: React.Dispatch<React.SetStateAction<ProductsResponse[]>>;
  setInventoryItems: React.Dispatch<React.SetStateAction<ItemResponse[]>>;
  fetchProducts: () => Promise<void>;
  fetchInventory: () => Promise<void>;
  isRetail: boolean;
}

export function useInventoryActions({
  setProducts,
  setInventoryItems,
  fetchProducts,
  fetchInventory,
  isRetail,
}: InventoryActionsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  // --- 1. AÇÕES DE INVENTÁRIO (INSUMOS) ---

  const saveInventoryItemAction = useCallback(
    async (payload: CreateItemRequest, id?: string) => {
      try {
        setIsSaving(true);
        let result: ItemResponse;

        if (id) {
          result = await inventoryService.updateItem(id, payload);
          toast.success("Insumo atualizado com sucesso!");
        } else {
          result = await inventoryService.createItem(payload);
          toast.success(
            payload.createProduct
              ? "Insumo e Produto criados com sucesso!"
              : "Insumo criado com sucesso!"
          );
        }

        // Se criou produto junto, recarrega a lista de produtos (fonte da verdade)
        if (payload.createProduct) {
          await fetchProducts();
        }

        // Atualiza a lista de insumos localmente
        setInventoryItems((prev) => {
          const index = prev.findIndex((item) => item.id === result.id);
          if (index !== -1) {
            const next = [...prev];
            next[index] = result;
            return next;
          }
          return [result, ...prev];
        });

        return result;
      } catch (error) {
        console.error("Erro ao salvar insumo:", error);
        toast.error("Erro ao salvar insumo.");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [fetchProducts, setInventoryItems]
  );

  // --- 2. AÇÕES DE PRODUTO (MENU/VAREJO) ---

  const saveProductAction = useCallback(
    async (values: Partial<MenuItemFormType>, id?: string) => {
      try {
        setIsSaving(true);
        let result: ProductsResponse;

        const payload = {
          ...values,
          isSimpleProduct: isRetail, // Força a flag de varejo com base no usuário logado
        };

        if (id) {
          result = await productsService.updateProduct(id, payload as any);
          toast.success("Produto atualizado com sucesso!");
          
          // Atualiza lista local
          setProducts((prev) => prev.map((p) => (p.id === id ? result : p)));

          // Se a API retornou que a receita atualizou o item de estoque, refazemos o fetch do estoque
          if ((result.productRecipes?.length ||0) > 0 ) {
             fetchInventory();
          }

        } else {
          result = await productsService.createProduct(payload as any);
          toast.success("Produto criado com sucesso!");
          
          // Adiciona ao topo da lista
          setProducts((prev) => [result, ...prev]);
        }

        // 🚀 Invalida o cache do PDV para forçar recarregamento na aba do PDV!
        queryClient.invalidateQueries({ queryKey: ["pdv", "products"] });

        return result;
      } catch (error) {
        console.error("Erro ao salvar produto:", error);
        toast.error("Erro ao salvar produto.");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [isRetail, setProducts, fetchInventory, queryClient]
  );

  const deleteProductAction = useCallback(
    async (product: ProductsResponse) => {
      // 1. Remove da UI otimisticamente
      setProducts((prev) => prev.filter((p) => p.id !== product.id));

      try {
        await productsService.deleteProduct(product.id);
        toast.success("Produto excluído com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["pdv", "products"] });
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        toast.error("Erro ao excluir produto. Restaurando...");
        // 2. Se falhar, devolve pra lista
        setProducts((prev) => [product, ...prev]);
        throw error;
      }
    },
    [setProducts, queryClient]
  );

  const toggleProductStatusAction = useCallback(
    async (product: ProductsResponse) => {
      const newStatus = !product.status;
      
      // UI Otimista
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
      );

      try {
        const updated = await productsService.updateProductStatus(product.id);
        toast.success(`Produto ${newStatus ? "ativado" : "pausado"} com sucesso!`);
        queryClient.invalidateQueries({ queryKey: ["pdv", "products"] });
        return updated;
      } catch (error) {
         toast.error("Erro ao atualizar o status do produto.");
         // Reverte
         setProducts((prev) =>
            prev.map((p) => (p.id === product.id ? { ...p, status: product.status } : p))
         );
         throw error;
      }
    },
    [setProducts, queryClient]
  );

  return {
    isSaving,
    saveInventoryItemAction,
    saveProductAction,
    deleteProductAction,
    toggleProductStatusAction,
  };
}
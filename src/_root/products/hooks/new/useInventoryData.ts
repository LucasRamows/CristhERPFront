// src/_features/inventory/hooks/useInventoryData.ts
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { inventoryService } from "../../../../services/inventory/inventory.service";
import type { ItemResponse } from "../../../../services/inventory/inventory.service";
import { productsService } from "../../../../services/products/products.service";
import type { ProductsResponse } from "../../../../services/products/products.types";

export function useInventoryData() {
  // 1. Estado dos Produtos
  const [products, setProducts] = useState<ProductsResponse[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // 2. Estado do Inventário (Insumos)
  const [inventoryItems, setInventoryItems] = useState<ItemResponse[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  // --- BUSCAS (FETCHES) ---

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const data = await productsService.getProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Erro ao carregar lista de produtos.");
      console.error(error);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const fetchInventory = useCallback(async () => {
    try {
      setIsLoadingInventory(true);
      const data = await inventoryService.getItems();
      setInventoryItems(data);
    } catch (error) {
      toast.error("Erro ao carregar lista de insumos.");
      console.error(error);
    } finally {
      setIsLoadingInventory(false);
    }
  }, []);

  return {
    // Produtos
    products,
    setProducts,
    isLoadingProducts,
    fetchProducts,

    // Inventário
    inventoryItems,
    setInventoryItems,
    isLoadingInventory,
    fetchInventory,
  };
}
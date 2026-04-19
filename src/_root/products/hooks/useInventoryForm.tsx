// src/pages/RootMenuPage/hooks/useProductsAndInventory.ts

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuthenticatedUser } from "../../../contexts/DataContext";
import {
  inventoryService,
  type ItemResponse,
} from "../../../services/inventory/inventory.service";
import { productsService } from "../../../services/products/products.service";
import type { ProductsResponse } from "../../../services/products/products.types";

export function useProductsAndInventory() {
  const { updateProductCategoryCount, businessType } =
    useAuthenticatedUser();
  const isRetail = businessType === "RETAIL";

  const [activeView, setActiveView] = useState<"products" | "inventory">(
    "products",
  );

  // Produtos
  const [products, setProducts] = useState<ProductsResponse[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Inventário
  const [inventoryItems, setInventoryItems] = useState<ItemResponse[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  // Controle dos Sheets
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isCreateInventoryOpen, setIsCreateInventoryOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<ProductsResponse | null>(null);
  const [selectedInventoryItem, setSelectedInventoryItem] =
    useState<ItemResponse | null>(null);

  // Fetch
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const data = await productsService.getProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Erro ao carregar produtos");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchInventory = async () => {
    try {
      setIsLoadingInventory(true);
      const data = await inventoryService.getItems();
      setInventoryItems(data);
    } catch (error) {
      toast.error("Erro ao carregar inventário");
    } finally {
      setIsLoadingInventory(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeView !== "inventory") return;
    if (inventoryItems.length > 0) return;
    fetchInventory();
  }, [activeView, inventoryItems.length]);

  // Handlers
  const handleCreateProductSuccess = (newItem: ProductsResponse) => {
    setProducts((prev) => [newItem, ...prev]);
    updateProductCategoryCount(
      newItem.categoryId,
      newItem.category?.name || "",
    );
    setIsCreateProductOpen(false);
  };
  

  const handleEditProductSuccess = (updatedItem: ProductsResponse) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedItem.id ? updatedItem : p)),
    );
    setIsEditProductOpen(false);
    setSelectedProduct(null);
  };

  const syncInventoryItemToProducts = (inventoryItem: ItemResponse) => {
    setProducts((prev) =>
      prev.map((product) => {
        const matchesInventoryItemId = product.inventoryItemId === inventoryItem.id;
        const matchesRecipe = product.productRecipes?.some(
          (recipe) => recipe.item.id === inventoryItem.id,
        );

        if (!matchesInventoryItemId && !matchesRecipe) {
          return product;
        }

        return {
          ...product,
          retailStock: Number(inventoryItem.currentStock || 0),
          retailMinStock: Number(inventoryItem.minStock || 0),
          inventoryItemId: inventoryItem.id,
          productRecipes: product.productRecipes?.map((recipe) =>
            recipe.item.id === inventoryItem.id
              ? {
                  ...recipe,
                  item: {
                    ...recipe.item,
                    currentStock: String(inventoryItem.currentStock ?? 0),
                    minStock: String(inventoryItem.minStock ?? 0),
                  },
                }
              : recipe,
          ),
        };
      }),
    );

    setSelectedProduct((current) => {
      if (!current) return current;
      const matchesInventoryItemId = current.inventoryItemId === inventoryItem.id;
      const matchesRecipe = current.productRecipes?.some(
        (recipe) => recipe.item.id === inventoryItem.id,
      );
      if (!matchesInventoryItemId && !matchesRecipe) return current;

      return {
        ...current,
        retailStock: Number(inventoryItem.currentStock || 0),
        retailMinStock: Number(inventoryItem.minStock || 0),
        inventoryItemId: inventoryItem.id,
        productRecipes: current.productRecipes?.map((recipe) =>
          recipe.item.id === inventoryItem.id
            ? {
                ...recipe,
                item: {
                  ...recipe.item,
                  currentStock: String(inventoryItem.currentStock ?? 0),
                  minStock: String(inventoryItem.minStock ?? 0),
                },
              }
            : recipe,
        ),
      };
    });
  };

  const upsertInventoryItem = (newItem: ItemResponse) => {
    setInventoryItems((prev) => {
      const index = prev.findIndex((item) => item.id === newItem.id);
      if (index !== -1) {
        const next = [...prev];
        next[index] = newItem;
        return next;
      }
      return [newItem, ...prev];
    });

    syncInventoryItemToProducts(newItem);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      await productsService.deleteProduct(selectedProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      toast.success("Produto excluído");
    } catch {
      toast.error("Erro ao excluir produto");
    }
  };

  const handleCreateInventorySuccess = (newItem: ItemResponse) => {
    upsertInventoryItem(newItem);
    setIsCreateInventoryOpen(false);
    setSelectedInventoryItem(null);
  };

  const handleUpdateInventoryItem = (updatedItem: ItemResponse) => {
    upsertInventoryItem(updatedItem);
  };

  return {
    activeView,
    setActiveView,
    isRetail,
    products,
    inventoryItems,
    isLoadingProducts,
    isLoadingInventory,

    // Sheets
    isCreateProductOpen,
    setIsCreateProductOpen,
    isEditProductOpen,
    setIsEditProductOpen,
    isCreateInventoryOpen,
    setIsCreateInventoryOpen,

    // Itens selecionados
    selectedProduct,
    setSelectedProduct,
    selectedInventoryItem,
    setSelectedInventoryItem,

    // Handlers
    handleCreateProductSuccess,
    handleEditProductSuccess,
    handleDeleteProduct,
    handleCreateInventorySuccess,
    handleUpdateInventoryItem,
  };
}

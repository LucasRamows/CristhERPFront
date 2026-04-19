import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { toast } from "sonner";
import { useAuthenticatedUser } from "../../../contexts/DataContext";
import {
  inventoryService,
  type ItemResponse,
  type CreateItemRequest,
} from "../../../services/inventory/inventory.service";
import { productsService } from "../../../services/products/products.service";
import type { ProductsResponse } from "../../../services/products/products.types";

type ActiveView = "products" | "inventory" | "entry-notes";

interface InventoryContextValue {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isRetail: boolean;
  products: ProductsResponse[];
  inventoryItems: ItemResponse[];
  isLoadingProducts: boolean;
  isLoadingInventory: boolean;
  isCreateProductOpen: boolean;
  setIsCreateProductOpen: (value: boolean) => void;
  isEditProductOpen: boolean;
  setIsEditProductOpen: (value: boolean) => void;
  isCreateInventoryOpen: boolean;
  setIsCreateInventoryOpen: (value: boolean) => void;
  selectedProduct: ProductsResponse | null;
  setSelectedProduct: (product: ProductsResponse | null) => void;
  selectedInventoryItem: ItemResponse | null;
  setSelectedInventoryItem: (item: ItemResponse | null) => void;
  handleCreateProductSuccess: (newItem: ProductsResponse) => void;
  handleEditProductSuccess: (updatedItem: ProductsResponse) => void;
  handleDeleteProduct: () => Promise<void>;
  handleCreateInventorySuccess: (newItem: ItemResponse) => void;
  handleUpdateInventoryItem: (updatedItem: ItemResponse) => void;
  handleUpdateProductStatusInList: () => void;
  handleSaveInventoryItem: (payload: CreateItemRequest, id?: string) => Promise<ItemResponse>;
  fetchInventory: () => Promise<void>;
}

export const InventoryContext = createContext<InventoryContextValue | null>(
  null,
);

export function InventoryProvider({ children }: PropsWithChildren) {
  const { updateProductCategoryCount, businessType } = useAuthenticatedUser();
  const isRetail = businessType === "RETAIL";

  const [activeView, setActiveView] = useState<ActiveView>("products");

  const [products, setProducts] = useState<ProductsResponse[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [inventoryItems, setInventoryItems] = useState<ItemResponse[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isCreateInventoryOpen, setIsCreateInventoryOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<ProductsResponse | null>(null);
  const [selectedInventoryItem, setSelectedInventoryItem] =
    useState<ItemResponse | null>(null);

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
        const matchesInventoryItemId =
          product.inventoryItemId === inventoryItem.id;
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
      const matchesInventoryItemId =
        current.inventoryItemId === inventoryItem.id;
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

    const productToDelete = selectedProduct;
    // --- OPTIMISTIC UPDATE ---
    setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));

    try {
      await productsService.deleteProduct(productToDelete.id);
      toast.success("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.error("Erro ao excluir produto. Restaurando...");
      // --- ROLLBACK ---
      setProducts((prev) => [productToDelete, ...prev]);
      throw error; // Let the caller know it failed
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

  const handleSaveInventoryItem = async (payload: CreateItemRequest, id?: string) => {
    try {
      let result: ItemResponse;

      if (id) {
        // MODO EDIÇÃO
        result = await inventoryService.updateItem(id, payload);
        toast.success("Insumo atualizado com sucesso!");
      } else {
        // MODO CRIAÇÃO (Híbrido - Item + Opcionalmente Produto)
        result = await inventoryService.createItem(payload);
        
        toast.success(
          payload.createProduct
            ? "Insumo e Produto criados com sucesso!"
            : "Item criado com sucesso!",
        );
      }

      // Se for um produto criado, precisamos atualizar a lista de produtos também
      if (payload.createProduct) {
        fetchProducts();
      }

      upsertInventoryItem(result);
      setIsCreateInventoryOpen(false);
      setSelectedInventoryItem(null);
      return result;
    } catch (error) {
      console.error("Erro ao salvar insumo:", error);
      toast.error("Erro ao salvar insumo.");
      throw error;
    }
  };

  const handleUpdateProductStatusInList = async () => {
    console.log("Atualizando status do produto na lista...", selectedProduct);
    if (!selectedProduct) return;

    const { id, status } = selectedProduct;
    const newStatus = !status;
    const product = await productsService.updateProductStatus(
      selectedProduct.id,
    );
    setProducts((prev) =>
      prev.map(
        (p) =>
          p.id === selectedProduct.id
            ? product 
            : p,
      ),
    );

    setSelectedProduct((current) =>
      current?.id === id ? { ...current, status: newStatus } : current,
    );
  };

  const contextValue: InventoryContextValue = {
    activeView,
    setActiveView,
    isRetail,
    products,
    inventoryItems,
    isLoadingProducts,
    isLoadingInventory,
    isCreateProductOpen,
    setIsCreateProductOpen,
    isEditProductOpen,
    setIsEditProductOpen,
    isCreateInventoryOpen,
    setIsCreateInventoryOpen,
    selectedProduct,
    setSelectedProduct,
    selectedInventoryItem,
    setSelectedInventoryItem,
    handleCreateProductSuccess,
    handleEditProductSuccess,
    handleDeleteProduct,
    handleCreateInventorySuccess,
    handleUpdateInventoryItem,
    handleUpdateProductStatusInList,
    handleSaveInventoryItem,
    fetchInventory,
  };

  return (
    <InventoryContext.Provider value={contextValue}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventoryContext() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error(
      "useInventoryContext must be used within InventoryProvider",
    );
  }
  return context;
}

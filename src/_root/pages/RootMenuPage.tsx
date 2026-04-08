import { SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  productsService,
  type ProductsResponse,
} from "../../services/products/products.service";

import LoadingComponent from "../../components/shared/LoadingComponent";
import { useAuthenticatedUser } from "../../contexts/DataContext";
import { type Category } from "../../components/shared/CategoryFilter";
import { CreateMenuItemSheet } from "../components/menu/CreateMenuItemSheet";
import EditMenuItemSheet from "../components/menu/EditMenuItemSheet";
import { PdvMenu } from "../components/pdv/PdvMenu";

const RootMenuPage = () => {
  const { user } = useAuthenticatedUser();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isPanelEditOpen, setIsPanelEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductsResponse[]>([]);
  const [itemSelected, setItemSelected] = useState<ProductsResponse | null>(
    null,
  );
  const [categories, setCategories] = useState<Category[]>(
    user?.restaurant?.ProductCategories || [],
  );
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productsService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast.error("Erro ao carregar cardápio.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateSuccess = async (newItem: any) => {
    setProducts((prev) => [...prev, newItem]);
    setCategories((prev) => {
      const exists = prev.find((c) => c.id === newItem.categoryId);

      if (exists) {
        return prev.map((c) =>
          c.id === newItem.categoryId
            ? {
                ...c,
                _count: {
                  products: (c._count?.products || 0) + 1,
                },
              }
            : c,
        );
      }

      return [
        ...prev,
        {
          id: newItem.categoryId,
          name: newItem.category.name,
          _count: { products: 1 },
        },
      ];
    });
    setIsPanelOpen(false);
  };

  const handleEditSubmit = async (updatedItem: any) => {
    setProducts((prev) =>
      prev.map((m) => (m.id === updatedItem.id ? updatedItem : m)),
    );
    setIsPanelEditOpen(false);
    setItemSelected(null);
  };

  const handleDelete = async () => {
    if (!itemSelected) return;
    setProducts((prev) => prev.filter((m) => m.id !== itemSelected.id));
    setCategories((prev) => {
      const exists = prev.find((c) => c.id === itemSelected.categoryId);

      if (exists) {
        return prev.map((c) =>
          c.id === itemSelected.categoryId
            ? {
                ...c,
                _count: {
                  products: (c._count?.products || 0) - 1,
                },
              }
            : c,
        );
      }

      return prev;
    });
    setIsPanelEditOpen(false);
    setItemSelected(null);
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col w-full h-full bg-background overflow-hidden select-none">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <PdvMenu
          categories={categories}
          products={products}
          isLoading={isLoading}
          onProductClick={(item: any) => {
            setItemSelected(item);
            setIsPanelEditOpen(true);
          }}
          onAddProductClick={() => {
            setItemSelected(null);
            setIsPanelOpen(true);
          }}
        />

        {products.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center p-20 m-6 border-2 border-dashed border-border rounded-[40px] bg-card/30">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-8 text-muted-foreground">
              <SearchX size={48} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">
              Ops! Nada por aqui.
            </h3>
            <p className="text-muted-foreground font-medium">
              Não encontramos produtos. Que tal cadastrar um novo?
            </p>
          </div>
        )}
      </div>

      {/* Sheet de Criação */}
      <CreateMenuItemSheet
        open={isPanelOpen}
        onOpenChange={setIsPanelOpen}
        onSuccess={handleCreateSuccess}
      />

      <EditMenuItemSheet
        open={isPanelEditOpen}
        onOpenChange={setIsPanelEditOpen}
        item={itemSelected}
        onEditSubmit={handleEditSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default RootMenuPage;

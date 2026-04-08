import { ChevronLeft, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { SearhListPicker } from "../../../components/shared/SearhListPicker";
import { Button } from "../../../components/ui/button";
import {
  productsService,
  type ProductsResponse,
} from "../../../services/products/products.service";
import type { PdvEntity } from "../../types/PdvEntity";
import {
  CategoryProductSelector,
  type Category,
} from "../../../components/shared/CategoryFilter";
import LoadingComponent from "../../../components/shared/LoadingComponent";

export interface PdvMenuProps {
  activeEntity?: PdvEntity | null;
  setActiveView?: (view: string) => void;
  categories: Category[];
  addToCart?: (product: ProductsResponse) => void;
  onProductClick?: (product: ProductsResponse) => void;
  onAddProductClick?: () => void;
  products?: ProductsResponse[];
  isLoading?: boolean;
  setAllProducts?: (products: ProductsResponse[]) => void;
}

export function PdvMenu({
  activeEntity,
  setActiveView,
  categories,
  addToCart,
  onProductClick,
  onAddProductClick,
  products: externalProducts,
  setAllProducts,
}: PdvMenuProps) {
  const [internalProducts, setInternalProducts] = useState<ProductsResponse[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (externalProducts) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const fetchProducts = async () => {
      try {
        const data = await productsService.getProductsActive();
        setInternalProducts(data);
        setAllProducts?.(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [externalProducts]);

  const products = externalProducts || internalProducts;
  if (isLoading) {
    return <LoadingComponent />;
  }
  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="mb-6 flex gap-2">
        <div className="flex-1 w-full">
          <SearhListPicker
            items={products}
            onSelect={(item) => onProductClick?.(item)}
            placeholder="Buscar produto por nome, código ou categoria..."
            searchKeys={["name", "code", "category"]}
            avatarText={(item) => item.name.charAt(0).toUpperCase()}
            renderTitle={(item) => item.name}
            renderSubtitle={(item) =>
              `${
                typeof item.category === "object"
                  ? item.category?.name
                  : item.category
              } • R$ ${Number(item.price).toFixed(2)}`
            }
          />
        </div>
        {onAddProductClick && (
          <Button onClick={onAddProductClick}>
            <Plus size={20} />
            <span>Adicionar</span>
          </Button>
        )}
      </div>
      {activeEntity &&
        (activeEntity.orderType === "TABLE" ||
          activeEntity.orderType === "CARD") &&
        setActiveView && (
          <button
            onClick={() =>
              setActiveView(
                activeEntity.orderType === "TABLE" ? "mesas" : "comandas",
              )
            }
            className="mb-6 flex items-center gap-2 text-primary hover:text-primary/80 font-bold w-fit"
          >
            <ChevronLeft size={20} /> Voltar para{" "}
            {activeEntity.orderType === "TABLE" ? "Mesas" : "Comandas"}
          </button>
        )}

      {/* Categorias e Produtos */}
      <CategoryProductSelector
        categories={categories}
        products={products}
        onProductSelect={(item) => {
          if (onProductClick) {
            onProductClick(item);
          } else if (addToCart) {
            addToCart(item);
          }
        }}
      />
    </div>
  );
}

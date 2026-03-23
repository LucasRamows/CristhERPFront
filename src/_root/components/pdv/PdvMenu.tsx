import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingComponent from "../../../components/shared/LoadingComponent";
import {
  productsService,
  type ProductsResponse,
} from "../../../services/products/products.service";
import { ProductCard } from "../menu/MenuProductCard";
import type { PdvEntity } from "../../types/PdvEntity";
import { SearhListPicker } from "../../../components/shared/SearhListPicker";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

export interface PdvMenuCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface PdvMenuProps {
  activeEntity?: PdvEntity | null;
  setActiveView?: (view: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: PdvMenuCategory[];
  addToCart?: (product: ProductsResponse) => void;
  onProductClick?: (product: ProductsResponse) => void;
  products?: ProductsResponse[];
  isLoading?: boolean;
  setAllProducts?: (products: ProductsResponse[]) => void;
}

export function PdvMenu({
  activeEntity,
  setActiveView,
  selectedCategory,
  setSelectedCategory,
  categories,
  addToCart,
  onProductClick,
  products: externalProducts,
  isLoading: externalLoading,
  setAllProducts,
}: PdvMenuProps) {
  const [internalProducts, setInternalProducts] = useState<ProductsResponse[]>(
    [],
  );
  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    if (externalProducts) return;

    const fetchProducts = async () => {
      try {
        setInternalLoading(true);
        const data = await productsService.getProductsActive();
        setInternalProducts(data);
        setAllProducts?.(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setInternalLoading(false);
      }
    };
    fetchProducts();
  }, [externalProducts]);

  const products = externalProducts || internalProducts;
  const isLoading =
    externalLoading !== undefined ? externalLoading : internalLoading;

  const categoriesWithProducts = new Set(products.map((p) => p.category));
  const visibleCategories = categories.filter(
    (cat) =>
      cat.id === "Todos" ||
      cat.id === "TODOS" ||
      categoriesWithProducts.has(cat.id),
  );

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="mb-6">
        <SearhListPicker
          items={products}
          onSelect={(item) => onProductClick?.(item)}
          placeholder="Buscar produto por nome, código ou categoria..."
          searchKeys={["name", "code", "category"]}
          renderItem={(item) => (
            <div className="flex items-center gap-2 py-1">
              <Avatar className="h-9 w-9 border border-gray-100 rounded-full flex items-center justify-center bg-gray-50 overflow-hidden">
                <AvatarFallback className="font-bold text-xs text-primary">
                  {item.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-zinc-800">
                  {item.name}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium uppercase">
                  {item.category} • R$ {Number(item.price).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        />
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

      {/* Categorias */}
      <div className="flex flex-wrap gap-3 mb-6 overflow-x-auto pb-2 custom-scrollbar shrink-0 no-scrollbar">
        {visibleCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-base whitespace-nowrap transition-all border-2 ${
              selectedCategory === cat.id
                ? "bg-gray-900 border-gray-900 text-white shadow-md"
                : "bg-white border-transparent text-gray-600 hover:border-gray-200"
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Lista de Produtos */}
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {products
            .filter(
              (p) =>
                selectedCategory === "Todos" ||
                selectedCategory === "TODOS" ||
                p.category === selectedCategory,
            )
            .map((product) => (
              <ProductCard
                key={product.id}
                item={product}
                icon={
                  (
                    categories.find((cat) => cat.id === product.category) || {
                      icon: null,
                    }
                  ).icon
                }
                formatMoney={(val) => `R$ ${val.toFixed(2)}`}
                onClick={(item) => {
                  if (onProductClick) {
                    onProductClick(item);
                  } else if (addToCart) {
                    addToCart(item);
                  }
                }}
              />
            ))}
        </div>
      )}
    </div>
  );
}

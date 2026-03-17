import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingComponent from "../../../components/shared/LoadingComponent";
import {
  productsService,
  type ProductsResponse,
} from "../../../services/products/products.service";
import { ProductCard } from "../menu/MenuProductCard";
import type { PdvEntity } from "../../pages/RootPdvPage";

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
  addToCart?: (product: any) => void;
  onProductClick?: (product: any) => void;
  products?: ProductsResponse[];
  isLoading?: boolean;
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
        const data = await productsService.getProducts();
        setInternalProducts(data);
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

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {activeEntity && activeEntity.id !== "caixa_balcao" && setActiveView && (
        <button
          onClick={() =>
            setActiveView(
              activeEntity.orderType === "TABLE" ? "mesas" : "comandas",
            )
          }
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold w-fit"
        >
          <ChevronLeft size={20} /> Voltar para{" "}
          {activeEntity.orderType === "TABLE" ? "Mesas" : "Comandas"}
        </button>
      )}

      {/* Categorias */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 custom-scrollbar shrink-0 no-scrollbar">
        {categories.map((cat) => (
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
                  console.log("1");
                  if (onProductClick) {
                    console.log("1.1");

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

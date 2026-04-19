// PDV/components/menu/ProductMenu.tsx
import { ChevronLeft } from "lucide-react";

import {
  CategoryProductSelector,
  type Category,
} from "../../../../components/shared/CategoryFilter";
import LoadingComponent from "../../../../components/shared/LoadingComponent";
import { SearchListPicker } from "../../../../components/shared/SearchListPicker";
import type { ProductsResponse } from "../../../../services/products/products.types";
import type { PdvEntity } from "../../../types/PdvEntity";
import { usePDV } from "../../utils/types";

interface ProductMenuProps {
  activeEntity?: PdvEntity | null;
  categories: Category[]; // vem do usuário autenticado
  products: ProductsResponse[];
  isLoading: boolean;
  onProductClick: (product: ProductsResponse) => void;
}

export function ProductsGrid({
  activeEntity,
  categories,
  products,
  isLoading,
  onProductClick,
}: ProductMenuProps) {
  const { setActiveView } = usePDV();

  const handleGoBack = () => {
    if (!activeEntity) return;

    if (activeEntity.orderType === "TABLE") {
      setActiveView("tables");
    } else if (activeEntity.orderType === "CARD") {
      setActiveView("comandas");
    } else {
      setActiveView("tables"); // fallback
    }
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Botão de Voltar */}
      {activeEntity &&
        (activeEntity.orderType === "TABLE" ||
          activeEntity.orderType === "CARD") && (
          <button
            onClick={handleGoBack}
            className="mb-6 flex items-center gap-2 text-primary hover:text-primary/80 font-bold w-fit transition-colors"
          >
            <ChevronLeft size={20} />
            Voltar para{" "}
            {activeEntity.orderType === "TABLE" ? "Mesas" : "Comandas"}
          </button>
        )}

      {/* Busca Global */}
      <div className="mb-6">
        <SearchListPicker
          items={products}
          onSelect={(item) => onProductClick(item)}
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

      {/* Categorias + Produtos */}
      <div className="flex-1 overflow-hidden">
        <CategoryProductSelector
          categories={categories}
          products={products}
          onProductSelect={(item) => onProductClick(item)}
        />
      </div>
    </div>
  );
}

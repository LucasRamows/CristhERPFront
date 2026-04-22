import { useAuthenticatedUser } from "../../../../contexts/DataContext";
import { usePDV } from "../../types/pdv.types.ts";
import { ProductsGrid } from "../entities/ProductsGrid.tsx";

export function ProductMenu() {
  const {
    activeEntity,
    products,
    isLoadingProducts,
    setIncludeService,
    setSelectedProduct,
  } = usePDV();
  const { categories } = useAuthenticatedUser();

  return (
    <ProductsGrid
      activeEntity={activeEntity}
      categories={categories}
      products={products}
      isLoading={isLoadingProducts}
      onProductClick={(product) => {
        setSelectedProduct(product);
        setIncludeService(true);
      }}
    />
  );
}

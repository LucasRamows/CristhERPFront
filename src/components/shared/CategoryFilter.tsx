import React, { useRef, useState } from "react";
import { type ProductsResponse } from "../../services/products/products.service";
import { ProductCard } from "../../_root/components/menu/MenuProductCard";

export interface Category {
  id: string;
  name: string;
  icon?: React.ReactNode;
  _count?: { products: number };
}

interface CategoryProductSelectorProps {
  categories: Category[];
  products: ProductsResponse[];
  onProductSelect?: (product: ProductsResponse) => void;
}

const ALL_ID = "TODOS";

export const CategoryProductSelector: React.FC<
  CategoryProductSelectorProps
> = ({ categories, products, onProductSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_ID);
  const [isAnimating, setAnimating] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const allCategories: Category[] = [
    { id: ALL_ID, name: "TODOS", _count: { products: products.length } },
    ...categories,
  ];

  const handleCategoryChange = (id: string) => {
    if (id === selectedCategory) return;
    setAnimating(true);
    setTimeout(() => {
      setSelectedCategory(id);
      setAnimating(false);
      if (listRef.current) listRef.current.scrollTop = 0;
    }, 160);
  };

  const filteredProducts =
    selectedCategory === ALL_ID
      ? products
      : products.filter((p) => p.categoryId === selectedCategory);

  return (
    <div className="w-full">
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 hide-scrollbar">
        {allCategories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm whitespace-nowrap transition-all border-2 ${
                isActive
                  ? "bg-primary border-primary text-primary-foreground font-bold shadow-md scale-[1.02]"
                  : "bg-card border-transparent text-muted-foreground hover:border-border font-medium"
              }`}
            >
              {cat.icon && <span>{cat.icon}</span>}
              {cat.name}
              {cat._count && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {cat._count.products}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Grid de produtos */}
      <div
        ref={listRef}
        style={{ opacity: isAnimating ? 0.5 : 1 }}
        className="w-full transition-opacity duration-150"
      >
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
            <p className="font-bold text-sm">Nenhum produto nesta categoria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pb-12">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                item={product}
                formatMoney={(val) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(val)
                }
                onClick={(item) => onProductSelect?.(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

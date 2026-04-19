import type { ProductsResponse } from "./products.types";

export const mapProductData = (product: ProductsResponse): ProductsResponse => {
  if (product.productRecipes && product.productRecipes.length === 1) {
    const singleRecipe = product.productRecipes[0];
    return {
      ...product,
      retailStock: Number(singleRecipe.item.currentStock || 0),
      retailMinStock: Number(singleRecipe.item.minStock || 0),
      inventoryItemId: singleRecipe.item.id,
    };
  }

  return product;
};

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { productsService } from "../../../services/products/products.service";
import type { MenuItemFormType } from "../../../services/products/products.types";
import { useProductFormHelpers } from "./useProductFormHelpers";
import { useInventoryContext } from "./InventoryContext";

export function useProductForm() {
  const {
    isRetail,
    selectedProduct: item,
    handleEditProductSuccess,
  } = useInventoryContext();
  const [isLoading, setIsLoading] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const form = useForm<MenuItemFormType>({
    defaultValues: {
      name: item?.name || "",
      price: Number(item?.price ?? 0),
      categoryId: item?.categoryId || (item as any)?.category?.id || "",
      unit: (((item as any)?.unit || "UN").toUpperCase() as "UN" | "KG"),
      description: item?.description || "",
      code: item?.code || "",
      imageUrl: item?.imageUrl || "",
      minStock: item?.minStock || 0,
      status: item?.status ?? true,
      items:
        (item as any)?.productRecipes?.map((recipe: any) => ({
          ingredientId: recipe.ingredientId,
          quantity: Number(recipe.quantity),
          name: recipe.ingredient?.name || "",
          unit: recipe.ingredient?.unit || "",
        })) || [],
    },
  });

  const {
    itemsRepo,
    isLoadingItems,
    itemsField,
    addIngredient,
    removeIngredient,
    updateQuantity,
  } = useProductFormHelpers({ form, isRetail });

  const handleSubmit = async (values: MenuItemFormType) => {
    if (!item) {
      return;
    }

    if (!values.name || values.name.trim().length === 0) {
      toast.error("O nome do produto é obrigatório.");
      return;
    }

    try {
      setIsLoading(true);
      const updatedItem = await productsService.updateProduct(
        item.id,
        values as any,
      );

      toast.success("Produto atualizado com sucesso!");
      setSendSuccess(true);
      handleEditProductSuccess(updatedItem);

      setTimeout(() => setSendSuccess(false), 2500);
    } catch (err) {
      toast.error("Não foi possível salvar as alterações.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    itemsField,
    imageUrl: form.watch("imageUrl"),
    itemsRepo,
    isLoadingItems,
    isLoading,
    sendSuccess,
    handleSubmit,
    addIngredient,
    removeIngredient,
    updateQuantity,
  };
}

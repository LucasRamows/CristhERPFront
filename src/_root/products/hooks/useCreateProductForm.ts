// create-product-sheet/hooks/useCreateProductForm.ts
import { useState } from "react";
import { useForm } from "react-hook-form";

import { menuItemSchema, type MenuItemFormType } from "../schemas/menuItemSchema";
import { useInventoryContext } from "./InventoryContext";
import { useProductFormHelpers } from "./useProductFormHelpers";

export function useCreateProductForm() {
  const { isRetail, handleSaveProduct } = useInventoryContext();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MenuItemFormType>({
    defaultValues: {
      name: "",
      price: 0,
      categoryId: "",
      unit: "UN",
      description: "",
      code: "",
      minStock: 0,
      status: true,
      items: [],
    },
  });

  const {
    itemsRepo,
    isLoadingItems,
    itemsField,
    addIngredient,
    updateQuantity,
    removeIngredient,
  } = useProductFormHelpers({ form, isRetail });

  const handleSubmit = async (values: MenuItemFormType) => {
    const result = menuItemSchema.safeParse(values);
    console.log("Dados do formulário:", result);
    // if (!result.success) {
    //   toast.error(result.error.issues[0]?.message || "Verifique os campos.");
    //   return;
    // }

    try {
      setIsLoading(true);
      await handleSaveProduct(values);
    } catch (err) {
      // Error is handled in context
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    itemsField,
    itemsRepo,
    isLoadingItems,
    isLoading,
    handleSubmit,
    addIngredient,
    updateQuantity,
    removeIngredient,
  };
}
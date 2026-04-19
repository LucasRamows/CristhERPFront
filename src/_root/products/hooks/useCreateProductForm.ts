// create-product-sheet/hooks/useCreateProductForm.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { productsService } from "../../../services/products/products.service";
import { menuItemSchema, type MenuItemFormType } from "../schemas/menuItemSchema";
import { useProductFormHelpers } from "./useProductFormHelpers";
import { useInventoryContext } from "./InventoryContext";

export function useCreateProductForm() {
  const { isRetail, handleCreateProductSuccess } = useInventoryContext();
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
      console.log("Payload para criação:", result.data);
      setIsLoading(true);

      const payload = {
        ...result.data,
        isSimpleProduct: isRetail,
      };

      const newItem = await productsService.createProduct(payload as any);

      toast.success("Produto criado com sucesso!");
      handleCreateProductSuccess(newItem);
    } catch (err) {
      toast.error("Erro ao criar o produto.");
      console.error(err);
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { MenuItemFormType } from "../../../../services/products/products.types";
import { useInventoryContext } from "./InventoryContext";
import { useProductFormHelpers } from "../useProductFormHelpers";

interface UseProductFormProps {
  onSuccessClose?: () => void;
}

export function useProductForm({ onSuccessClose }: UseProductFormProps = {}) {
  // 1. Puxando as novas nomenclaturas e funções do contexto unificado
  const {
    isRetail,
    activeProduct: item,
    saveProductAction,
    setActiveProduct,
  } = useInventoryContext();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MenuItemFormType>({
    defaultValues: {
      name: item?.name || "",
      price: Number(item?.price ?? 0),
      categoryId: item?.categoryId || (item as any)?.category?.id || "",
      unit: ((item as any)?.unit || "UN").toUpperCase() as "UN" | "KG",
      description: item?.description || "",
      code: item?.code || "",
      imageUrl: item?.imageUrl || "",
      minStock: Number(item?.productRecipes?.[0]?.item?.minStock) || 0,
      status: item?.status ?? true,
      // 2. Novas flags de controle de estoque/receita
      isSimpleProduct: item?.isSimpleProduct ?? false,
      manageStock: item?.manageStock ?? true,
      items:
        (item as any)?.productRecipes?.map((recipe: any) => ({
          itemId: recipe.itemId,
          quantity: Number(recipe.quantity),
          name: recipe.item?.name || "",
          unit: recipe.item?.unit || "",
        })) || [],
    },
  });

  // ESSENCIAL: Atualiza os defaultValues sempre que o item selecionado mudar
  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name || "",
        price: Number(item.price ?? 0),
        categoryId: item.categoryId || (item as any).category?.id || "",
        unit: ((item as any).unit || "UN").toUpperCase() as "UN" | "KG",
        description: item.description || "",
        code: item.code || "",
        imageUrl: item.imageUrl || "",
        minStock:
          Number((item as any).productRecipes?.[0]?.item?.minStock) || 0,
        status: item.status ?? true,
        // Garantindo que o reset pegue as novas flags também
        isSimpleProduct: item.isSimpleProduct ?? false,
        manageStock: item.manageStock ?? true,
        items:
          (item as any).productRecipes?.map((recipe: any) => ({
            itemId: recipe.itemId,
            quantity: Number(recipe.quantity),
            name: recipe.item?.name || "",
            unit: recipe.item?.unit || "",
          })) || [],
      });
    }
  }, [item, form]);

  const {
    itemsRepo,
    isLoadingItems,
    itemsField,
    addIngredient,
    removeIngredient,
    updateQuantity,
  } = useProductFormHelpers({ form, isRetail });

  const handleSubmit = async (values: MenuItemFormType) => {
    if (!values.name || values.name.trim() === "") {
      toast.error("O nome do produto é obrigatório.");
      return;
    }

    if (values.price === undefined || values.price === null) {
      toast.error("O preço é obrigatório.");
      return;
    }

    if (!values.categoryId) {
      toast.error("A categoria é obrigatória.");
      return;
    }

    if (!values.code || values.code.trim() === "") {
      toast.error("O código de referência é obrigatório.");
      return;
    }

    if (!values.unit) {
      toast.error("A unidade de medida é obrigatória.");
      return;
    }

    const showMinStock =
      (isRetail && values.manageStock) || (!isRetail && values.isSimpleProduct);
    if (
      showMinStock &&
      (values.minStock === undefined ||
        values.minStock === null ||
        values.minStock < 0)
    ) {
      toast.error("O estoque mínimo é obrigatório.");
      return;
    }

    try {
      setIsLoading(true);

      let payloadToSend: Partial<MenuItemFormType>;

      if (item && item.id) {
        // 3. MANTIDO: Lógica impecável de dirtyFields
        const { dirtyFields } = form.formState;
        const changedValues: Partial<MenuItemFormType> = {};

        (Object.keys(dirtyFields) as Array<keyof MenuItemFormType>).forEach(
          (key) => {
            if (dirtyFields[key]) {
              (changedValues as any)[key] = values[key];
            }
          },
        );

        if (dirtyFields.items) {
          changedValues.items = values.items;
        }

        if (Object.keys(changedValues).length === 0) {
          toast.info("Nenhuma alteração foi feita.");
          setIsLoading(false);
          // Fecha a gaveta se o usuário não mudou nada e clicou em salvar
          if (onSuccessClose) onSuccessClose();
          return;
        }

        payloadToSend = changedValues;
      } else {
        payloadToSend = values;
      }
      // 4. Chamando a nova action do contexto
      await saveProductAction(payloadToSend, item?.id);

      // 5. Sucesso: Fecha a gaveta limpando o item ativo e rodando o callback (se existir)
      setActiveProduct(null);
      if (onSuccessClose) onSuccessClose();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
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
    handleSubmit,
    addIngredient,
    removeIngredient,
    updateQuantity,
  };
}

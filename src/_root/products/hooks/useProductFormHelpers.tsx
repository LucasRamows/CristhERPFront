import { useEffect, useState } from "react";
import { inventoryService, type ItemResponse } from "../../../services/inventory/inventory.service";
import type { Path, UseFormReturn } from "react-hook-form";

export interface ProductIngredientFormItem {
  itemId: string;
  quantity: number;
  name?: string;
  unit?: string;
}

interface UseProductFormHelpersProps<TFormValues extends { items?: ProductIngredientFormItem[] }> {
  form: UseFormReturn<TFormValues>;
  isRetail: boolean;
}

export function useProductFormHelpers<TFormValues extends { items?: ProductIngredientFormItem[] }>({
  form,
  isRetail,
}: UseProductFormHelpersProps<TFormValues>) {
  const [itemsRepo, setItemsRepo] = useState<ItemResponse[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  useEffect(() => {
    if (isRetail) return;

    const fetchItems = async () => {
      try {
        setIsLoadingItems(true);
        const res = await inventoryService.getItems();
        setItemsRepo(res);
      } catch (err) {
        console.error("Erro ao buscar insumos:", err);
      } finally {
        setIsLoadingItems(false);
      }
    };

    fetchItems();
  }, [isRetail]);

  const getItems = () =>
    (form.getValues("items" as Path<TFormValues>) as ProductIngredientFormItem[]) || [];

  const addIngredient = (newItem: ItemResponse) => {
    const items = getItems();
    if (items.find((item) => item.itemId === newItem.id)) return;

    form.setValue(
      "items" as Path<TFormValues>,
      [...items, {
        itemId: newItem.id,
        quantity: 0,
        name: newItem.name,
        unit: newItem.unit,
      }] as any,
    );
  };

  const removeIngredient = (itemId: string) => {
    const items = getItems();
    form.setValue(
      "items" as Path<TFormValues>,
      items.filter((item) => item.itemId !== itemId) as any,
    );
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    const items = getItems();
    form.setValue(
      "items" as Path<TFormValues>,
      items.map((item) =>
        item.itemId === itemId ? { ...item, quantity } : item,
      ) as any,
    );
  };

  

  return {
    itemsRepo,
    setItemsRepo,
    isLoadingItems,
    addIngredient,
    removeIngredient,
    updateQuantity,
    itemsField: (form.watch("items" as Path<TFormValues>) || []) as ProductIngredientFormItem[],
  };
}

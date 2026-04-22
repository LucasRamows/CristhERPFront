// edit-product-sheet/types.ts

import type { ProductsResponse } from "../../../services/products/products.types";

export type View = "options" | "edit";

export interface EditMenuItemSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isRetail?: boolean;
  item?: ProductsResponse | null;
  onEditSubmit?: (item: ProductsResponse) => void;
  onDelete?: () => void;
}

export interface ProductOptionsViewProps {
  item: ProductsResponse;
  isRetail: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

// ← Aqui está o que você perguntou:
export interface ProductEditViewProps {
  item: ProductsResponse;
  isRetail: boolean;
  onSubmit: (item: ProductsResponse) => void;
  onBack?: () => void; // opcional
}

export interface CreateProductSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (newItem: any) => void;
}

export interface CreateProductFormProps {
  isRetail: boolean;
  onSuccess: (newItem: any) => void;
  onCancel: () => void;
}

export interface IngredientFormItem {
  itemId: string;
  name: string;
  unit: string;
  quantity: number;
}

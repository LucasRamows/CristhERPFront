import { useEffect, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "../../../../components/ui/sheet";
import ProductEditView from "../form/ProductEditView";
import ProductOptionsView from "../form/ProductOptionsView";
import { useInventoryContext } from "../../hooks/InventoryContext";
import type { EditMenuItemSheetProps } from "../../types/product.types";

type View = "options" | "edit";

export function EditProductSheet({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  isRetail: isRetailProp,
  item: itemProp,
  onEditSubmit: onEditSubmitProp,
}: EditMenuItemSheetProps) {
  const {
    isRetail,
    isEditProductOpen,
    setIsEditProductOpen,
    selectedProduct,
    handleEditProductSuccess,
  } = useInventoryContext();

  const [view, setView] = useState<View>("options");

  const open = openProp ?? isEditProductOpen;
  const onOpenChange = onOpenChangeProp ?? setIsEditProductOpen;
  const effectiveIsRetail = isRetailProp ?? isRetail;
  const effectiveItem = itemProp ?? selectedProduct;
  const onEditSubmit = onEditSubmitProp ?? handleEditProductSuccess;

  // Reset view quando abrir ou trocar de item
  useEffect(() => {
    if (open && effectiveItem) {
      setView("options");
    }
  }, [open, effectiveItem?.id]);

  if (!effectiveItem) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-125 p-0 flex flex-col h-full bg-white border-l border-gray-100 outline-none"
      >
        <SheetTitle className="sr-only">
          Gerenciar {effectiveItem.name}
        </SheetTitle>

        {view === "options" ? (
          <ProductOptionsView
            item={effectiveItem}
            isRetail={effectiveIsRetail}
            onEditClick={() => setView("edit")}
          />
        ) : (
          <ProductEditView
            item={effectiveItem}
            isRetail={effectiveIsRetail}
            onSubmit={onEditSubmit}
            onBack={() => setView("options")}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "../../../../components/ui/sheet";
import { CreateProductForm } from "../form/CreateProductForm";
import { useInventoryContext } from "../../hooks/InventoryContext";
import type { CreateProductSheetProps } from "../../types/product.types";

export function CreateProductSheet({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  onSuccess: onSuccessProp,
}: CreateProductSheetProps) {
  const {
    isRetail,
    isCreateProductOpen,
    setIsCreateProductOpen,
    handleCreateProductSuccess,
  } = useInventoryContext();

  const open = openProp ?? isCreateProductOpen;
  const onOpenChange = onOpenChangeProp ?? setIsCreateProductOpen;
  const onSuccess = onSuccessProp ?? handleCreateProductSuccess;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-130 p-0 flex flex-col h-full bg-white border-l border-gray-100 outline-none"
      >
        <SheetTitle className="sr-only">Criar Novo Produto</SheetTitle>

        <CreateProductForm
          isRetail={isRetail}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}

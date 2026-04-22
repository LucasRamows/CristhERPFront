import { useEffect, useState, type ReactNode } from "react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../../../../components/ui/sheet";
import { useInventoryContext } from "../../hooks/new/InventoryContext";
import ProductEditView from "../form/ProductEditView";
import ProductOptionsView from "../form/ProductOptionsView";

export function EditProductSheet({ children }: { children?: ReactNode }) {
  // Puxamos a nova estrutura do nosso Contexto Mestre
  const {
    activeProduct, // Substitui o selectedProduct
    setActiveProduct, // Usado para fechar o modal limpando a seleção
  } = useInventoryContext();

  const [view, setView] = useState<"options" | "edit">("options");

  // A MÁGICA: A gaveta está aberta se houver um produto ativo!
  const isOpen = !!activeProduct;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Ao fechar a gaveta, limpamos o produto ativo e resetamos a view
      setActiveProduct(null);
      setTimeout(() => setView("options"), 300); // Aguarda a animação de fechar
    }
  };

  // Reset view quando trocar de item (caso clique em outro produto com a gaveta já aberta)
  useEffect(() => {
    if (isOpen && activeProduct) {
      setView("options");
    }
  }, [isOpen, activeProduct?.id]);

  // Se não tem produto selecionado, não renderiza o conteúdo interno
  if (!activeProduct) return null;

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      {/* Suporta ser aberto via Trigger (botão envelopado) se você quiser no futuro */}
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}

      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-125 p-0 flex flex-col h-full bg-white border-l border-gray-100 outline-none"
      >
        <SheetTitle className="sr-only">
          Gerenciar {activeProduct.name}
        </SheetTitle>

        {view === "options" ? (
          <ProductOptionsView onEditClick={() => setView("edit")} />
        ) : (
          <ProductEditView onBack={() => setView("options")} />
        )}
      </SheetContent>
    </Sheet>
  );
}

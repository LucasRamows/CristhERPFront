// src/_features/inventory/components/sheets/CreateProductSheet.tsx
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../../../../components/ui/sheet";
import { CreateProductForm } from "../form/CreateProductForm";

interface CreateProductSheetProps {
  children?: ReactNode;
}

export function CreateProductSheet({ children }: CreateProductSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* O gatilho envolve o botão! */}
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}

      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-130 p-0 flex flex-col h-full bg-white border-l border-gray-100 outline-none z-[110]"
      >
        <SheetTitle className="sr-only">Criar Novo Produto</SheetTitle>
        
        {/* Renderização Condicional: Garante que o form nasça limpo toda vez que abrir */}
        {isOpen && (
          <CreateProductForm
            onCancel={() => setIsOpen(false)} 
            onSuccessClose={() => setIsOpen(false)} // Fecha quando der sucesso
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
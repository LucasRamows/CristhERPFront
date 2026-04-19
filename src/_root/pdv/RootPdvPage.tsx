import { usePDV } from "./utils/types.ts";

import { useState } from "react";
import { CartSheet } from "./components/cart/CartSheet.tsx";
import { ComandasGrid } from "./components/entities/ComandasGrid.tsx";
import { TablesGrid } from "./components/entities/TablesGrid.tsx";
import { PDVHeader } from "./components/layout/PDVHeader.tsx";
import { ProductMenu } from "./components/menu/ProductMenu.tsx";
import { ProductModal } from "./components/modals/ProductModal.tsx";
import { AddComandaSheet } from "./components/sheets/AddComandaSheet.tsx";
import { PDVProvider } from "./utils/PDVProvider.tsx";

export default function RootPDVPage() {
  return (
    <PDVProvider>
      <PDVContent />
    </PDVProvider>
  );
}

function PDVContent() {
  const { activeView, isLoading, isCartSheetOpen } = usePDV();
  const [isAddComandaOpen, setIsAddComandaOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 h-full bg-background overflow-hidden select-none">
      <PDVHeader />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden p-4 bg-card rounded-xl">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <p>Carregando...</p>
            </div>
          ) : (
            <>
              {activeView === "tables" && <TablesGrid />}
              {activeView === "comandas" && (
                <ComandasGrid setIsAddComandaOpen={setIsAddComandaOpen} />
              )}
              {activeView === "menu" && <ProductMenu />}
            </>
          )}
        </div>
        <AddComandaSheet
          isOpen={isAddComandaOpen}
          onOpenChange={setIsAddComandaOpen}
        />
        {isCartSheetOpen && <CartSheet />}

        <ProductModal />
      </div>
    </div>
  );
}

// PDV/components/layout/PDVHeader.tsx
import { ShoppingBag } from "lucide-react";
import { useMemo } from "react";

import { PageTabNavigation } from "../../../../components/shared/PageTabNavigation";
import { useAuthenticatedUser } from "../../../../contexts/DataContext";
import { pdvTabs } from "../../../../lib/sidebarNavFilter";
import { HistorySheet } from "../sheets/HistorySheet";

import type { PDVView } from "../../types/pdv.types";
import { usePDV } from "../../types/pdv.types";

export function PDVHeader() {
  const { activeView, setActiveView, handleCaixaRapido, activeEntity } =
    usePDV();

  const { businessType } = useAuthenticatedUser();

  const filteredTabs = useMemo(() => {
    return pdvTabs.filter(
      (tab) => tab.businessType === "ALL" || tab.businessType === businessType,
    );
  }, [businessType]);

  const handleTabChange = (id: string) => {
    if (id === "caixa_rapido") {
      handleCaixaRapido();
    } else {
      setActiveView(id as PDVView);
    }
  };

  const getActiveTab = (): string => {
    if (
      activeView === "menu" &&
      (activeEntity?.id === "caixa_balcao" ||
        activeEntity?.orderType === "COUNTER")
    ) {
      return "caixa_rapido";
    }
    return activeView;
  };

  return (
    <div className="flex h-12 md:min-h-14 w-full items-center justify-between overflow-hidden">
      {filteredTabs.length > 1 ? (
        <PageTabNavigation
          tabs={filteredTabs}
          activeTab={getActiveTab()}
          onTabChange={handleTabChange}
        />
      ) : (
        /* Versão simples quando só tem uma aba */
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#E2F898] text-gray-900 shadow-sm">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              PDV
            </p>
            <h1 className="text-xl font-black tracking-tight">
              Ponto de Venda
            </h1>
          </div>
        </div>
      )}

      <HistorySheet />
    </div>
  );
}

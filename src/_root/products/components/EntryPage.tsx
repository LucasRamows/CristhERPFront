// EntryPage.tsx


import LoadingComponent from "../../../components/shared/LoadingComponent";

import { EntryNoteProvider, useEntryNote } from "../hooks/EntryNoteContext";

import { GeneralDataSection } from "./sections/GeneralDataSection";
import { IcmsSection } from "./sections/IcmsSection";
import { ItemsSection } from "./sections/ItemsSection";
import { SupplierSection } from "./sections/SupplierSection";
import { TaxesAndExtrasSection } from "./sections/TaxesAndExtrasSection";
import { TotalsSection } from "./sections/TotalsSection";
import { TransportSection } from "./sections/TransportSection";

export default function EntryPage({
  initialData,
}: {
  initialData?: any;
}) {
  return (
    <EntryNoteProvider initialData={initialData}>
      <EntryNoteContent />
    </EntryNoteProvider>
  );
}

function EntryNoteContent() {
  const { isLoadingData } = useEntryNote();

  if (isLoadingData) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex-1 overflow-y-auto h-full p-4  custom-scrollbar">
      <div className="space-y-4">
        <div className="lg:col-span-3">
          <GeneralDataSection />
        </div>
        <div className="lg:col-span-2">
          <SupplierSection />
        </div>

        {/* Produtos */}
        <ItemsSection />

        {/* ICMS + Outros Valores */}
        <IcmsSection />
        <TaxesAndExtrasSection />

        {/* Transporte */}
        <TransportSection />

        {/* Totais */}
        <TotalsSection />
      </div>
    </div>
  );
}

// src/_features/passbook/hooks/usePassbookData.ts
import { useState, useMemo } from "react";
import type { CostomersResponse } from "../../../services/costomers/customer.type";
import type { LedgerEntry } from "../../../services/costomers/customer.type";

export function usePassbookData() {
  const [clients, setClients] = useState<CostomersResponse[]>([]);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Computa o cliente ativo baseado no ID
  const activeClient = useMemo(
    () => clients.find((c) => c.id === activeClientId) || null,
    [clients, activeClientId]
  );

  return {
    clients,
    setClients,
    activeClientId,
    setActiveClientId,
    activeClient,
    ledgerEntries,
    setLedgerEntries,
    isLoadingData,
    setIsLoadingData,
  };
}
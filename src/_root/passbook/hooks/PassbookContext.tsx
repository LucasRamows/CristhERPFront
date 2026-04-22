// src/_features/passbook/contexts/PassbookContext.tsx
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { usePassbookActions } from "../hooks/usePassbookActions";
import { usePassbookData } from "../hooks/usePassbookData";
import { usePassbookUI } from "../hooks/usePassbookUI";
import { usePassbookTicket } from "../hooks/usePassbookTicket";

type PassbookContextType = ReturnType<typeof usePassbookData> &
  ReturnType<typeof usePassbookUI> &
  ReturnType<typeof usePassbookActions> &
  ReturnType<typeof usePassbookTicket>;

const PassbookContext = createContext<PassbookContextType | undefined>(
  undefined,
);

export function PassbookProvider({ children }: { children: ReactNode }) {
  // 1. Instancia os Dados
  const data = usePassbookData();

  const ui = usePassbookUI();
  const ticket = usePassbookTicket();
  const actions = usePassbookActions({
    setClients: data.setClients,
    setLedgerEntries: data.setLedgerEntries,
    setIsLoadingData: data.setIsLoadingData,
    activeClientId: data.activeClientId,
  });

  // 4. (Opcional) Lifecycle inicial: buscar clientes ao montar
  useEffect(() => {
    actions.fetchClients();
  }, [actions.fetchClients]);

  // 5. Lifecycle: buscar extrato ao mudar cliente ativo
  useEffect(() => {
    if (data.activeClientId) {
      actions.fetchLedger(data.activeClientId);
    }
  }, [data.activeClientId, actions.fetchLedger]);

  return (
    <PassbookContext.Provider value={{ ...data, ...ui, ...actions, ...ticket }}>
      {children}
    </PassbookContext.Provider>
  );
}

export const usePassbook = () => {
  const context = useContext(PassbookContext);
  if (!context)
    throw new Error("usePassbook deve ser usado dentro do PassbookProvider");
  return context;
};

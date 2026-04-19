// hooks/useEntryNoteTotals.ts
import { useMemo } from "react";
import type { EntryNoteItem, EntryNoteTotals } from "./type";

const round3 = (n: number) => Math.round(n * 1000) / 1000;

export function useEntryNoteTotals(
  items: EntryNoteItem[],
  overrides: Partial<Pick<EntryNoteTotals, "frete" | "seguro" | "outrasDespesas" | "descontos">>
) {
  return useMemo(() => {
    const totalProdutos = round3(
      items.reduce((acc, i) => acc + i.valorTotal, 0)
    );
    const valorIpi = round3(items.reduce((acc, i) => acc + i.valorIpi, 0));
    const baseIcms = round3(items.reduce((acc, i) => acc + i.baseIcms, 0));
    const valorIcms = round3(items.reduce((acc, i) => acc + i.valorIcms, 0));
    const valorPis = round3(items.reduce((acc, i) => acc + i.valorPis, 0));
    const valorCofins = round3(items.reduce((acc, i) => acc + i.valorCofins, 0));

    const frete = overrides.frete ?? 0;
    const seguro = overrides.seguro ?? 0;
    const outrasDespesas = overrides.outrasDespesas ?? 0;
    const descontos = overrides.descontos ?? 0;

    const totalNota = round3(
      totalProdutos + valorIpi + frete + seguro + outrasDespesas - descontos
    );

    return {
      totalProdutos,
      totalNota,
      frete,
      seguro,
      outrasDespesas,
      descontos,
      valorIpi,
      baseIcms,
      valorIcms,
      baseIcmsSt: 0,
      valorIcmsSt: 0,
      valorPis,
      valorCofins,
    };
  }, [items, overrides]);
}
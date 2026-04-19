// hooks/useXmlImport.ts
import { useCallback } from "react";
import { toast } from "sonner";
import type { EntryNoteForm, EntryNoteItem } from "./type";

const getText = (node: Element | null | undefined, tag: string): string =>
  node?.getElementsByTagName(tag)[0]?.textContent?.trim() ?? "";

const getNum = (node: Element | null | undefined, tag: string): number =>
  parseFloat(getText(node, tag)) || 0;

export function useXmlImport(onImport: (data: Partial<EntryNoteForm>) => void) {
  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const xml = new DOMParser().parseFromString(
            e.target?.result as string,
            "application/xml"
          );

          const ide = xml.querySelector("ide");
          const emit = xml.querySelector("emit");
          const enderEmit = xml.querySelector("enderEmit");
          const total = xml.querySelector("ICMSTot");
          const transp = xml.querySelector("transp");
          const transporta = xml.querySelector("transporta");

          // Itens
          const detNodes = xml.querySelectorAll("det");
          const items: EntryNoteItem[] = Array.from(detNodes).map((det) => {
            const prod = det.querySelector("prod");
            const imposto = det.querySelector("imposto");
            const icms = imposto?.querySelector("ICMS");
            const icmsInner = icms?.children[0] ?? null;
            const pis = imposto?.querySelector("PISAliq, PISOutr");
            const cofins = imposto?.querySelector("COFINSAliq, COFINSOutr");
            const ipi = imposto?.querySelector("IPI");

            const qty = getNum(prod, "qCom");
            const unitPrice = getNum(prod, "vUnCom");

            return {
              id: "3432423",
              codigoProduto: getText(prod, "cProd"),
              nome: getText(prod, "xProd"),
              quantidade: qty,
              unidade: getText(prod, "uCom"),
              valorUnitario: unitPrice,
              valorTotal: getNum(prod, "vProd"),
              desconto: getNum(prod, "vDesc"),
              cfop: getText(prod, "CFOP"),
              ncm: getText(prod, "NCM"),
              cstIcms: getText(icmsInner, "CST") || getText(icmsInner, "CSOSN"),
              aliqIcms: getNum(icmsInner, "pICMS"),
              baseIcms: getNum(icmsInner, "vBC"),
              valorIcms: getNum(icmsInner, "vICMS"),
              cstPisCofins: getText(pis, "CST"),
              aliqPis: getNum(pis, "pPIS"),
              aliqCofins: getNum(cofins, "pCOFINS"),
              valorPis: getNum(pis, "vPIS"),
              valorCofins: getNum(cofins, "vCOFINS"),
              valorIpi: getNum(ipi, "vIPI"),
            };
          });

          onImport({
            numero: getText(ide, "nNF"),
            serie: getText(ide, "serie"),
            dataEmissao: getText(ide, "dhEmi").split("T")[0],
            chaveNfe:
              xml.querySelector("infNFe")?.getAttribute("Id")?.replace("NFe", "") ?? "",
            cfop: items[0]?.cfop ?? "",
            naturezaOperacao: getText(ide, "natOp"),
            modelo: "NFe_55",

            supplier: {
              razaoSocial: getText(emit, "xNome"),
              nomeFantasia: getText(emit, "xFant"),
              cnpj: getText(emit, "CNPJ"),
              ie: getText(emit, "IE"),
              rua: getText(enderEmit, "xLgr"),
              numero: getText(enderEmit, "nro"),
              bairro: getText(enderEmit, "xBairro"),
              cidade: getText(enderEmit, "xMun"),
              estado: getText(enderEmit, "UF"),
              cep: getText(enderEmit, "CEP"),
            },

            items,

            totals: {
              totalProdutos: getNum(total, "vProd"),
              totalNota: getNum(total, "vNF"),
              frete: getNum(total, "vFrete"),
              seguro: getNum(total, "vSeg"),
              outrasDespesas: getNum(total, "vOutro"),
              descontos: getNum(total, "vDesc"),
              valorIpi: getNum(total, "vIPI"),
              baseIcms: getNum(total, "vBC"),
              valorIcms: getNum(total, "vICMS"),
              baseIcmsSt: getNum(total, "vBCST"),
              valorIcmsSt: getNum(total, "vST"),
            },

            transport: {
              transportadora: getText(transporta, "xNome"),
              cnpj: getText(transporta, "CNPJ"),
              placa: getText(transp?.querySelector("veicTransp"), "placa"),
              uf: getText(transp?.querySelector("veicTransp"), "UF"),
              fretePorConta:
                getText(transp, "modFrete") === "0" ? "EMITTER" : "RECEIVER",
              pesoBruto: getNum(transp?.querySelector("vol"), "pesoB"),
              pesoLiquido: getNum(transp?.querySelector("vol"), "pesoL"),
              volume: getNum(transp?.querySelector("vol"), "qVol"),
            },
          });

          toast.success("XML importado com sucesso!");
        } catch {
          toast.error("Erro ao processar o XML. Verifique o arquivo.");
        }
      };
      reader.readAsText(file);
    },
    [onImport]
  );

  const openFilePicker = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xml";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  };

  return { openFilePicker };
}

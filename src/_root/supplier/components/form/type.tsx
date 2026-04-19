// types/entry-note.types.ts

export type NoteModel = "NFe_55" | "NF_1" | "OTHER";
export type FreightResponsibility = "EMITTER" | "RECEIVER" | "NONE";

export interface EntryNoteSupplier {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  ie: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface EntryNoteItem {
  id: string; // uuid local
  codigoProduto: string;
  nome: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number; // 3 casas decimais
  valorTotal: number;
  desconto: number;
  cfop: string;
  ncm: string;
  cstIcms: string;
  aliqIcms: number;
  baseIcms: number;
  valorIcms: number;
  cstPisCofins: string;
  aliqPis: number;
  aliqCofins: number;
  valorPis: number;
  valorCofins: number;
  valorIpi: number;
}

export interface EntryNoteTotals {
  totalProdutos: number;
  totalNota: number;
  frete: number;
  seguro: number;
  outrasDespesas: number;
  descontos: number;
  valorIpi: number;
  baseIcms: number;
  valorIcms: number;
  baseIcmsSt: number;
  valorIcmsSt: number;
}

export interface EntryNoteTransport {
  transportadora: string;
  cnpj: string;
  placa: string;
  uf: string;
  fretePorConta: FreightResponsibility;
  pesoBruto: number;
  pesoLiquido: number;
  volume: number;
}

export interface EntryNoteForm {
  // Dados gerais
  numero: string;
  serie: string;
  modelo: NoteModel;
  dataEmissao: string;
  dataEntrada: string;
  dataSaida: string;
  chaveNfe: string;
  cfop: string;
  naturezaOperacao: string;

  supplier: EntryNoteSupplier;
  items: EntryNoteItem[];
  totals: EntryNoteTotals;
  transport: EntryNoteTransport;
}

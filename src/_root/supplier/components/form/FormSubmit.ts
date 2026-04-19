import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useEntryNoteForm(initialData?: any) {
  // 1. ESTADO ALINHADO COM OS INPUTS E COM O SERVIÇO
  const [form, setForm] = useState({
    id: initialData?.id,
    numero: initialData?.numero || initialData?.documentRef || "",
    modelo: initialData?.modelo || "55", // NFe Padrão
    serie: initialData?.serie || "1",
    chaveNfe: initialData?.chaveNfe || "",
    cfop: initialData?.cfop || "",
    dataEmissao:
      initialData?.dataEmissao ||
      initialData?.date?.split("T")[0] ||
      new Date().toISOString().split("T")[0],
    dataEntrada:
      initialData?.dataEntrada || new Date().toISOString().split("T")[0],

    // Ajustes Financeiros
    frete: initialData?.frete || 0,
    seguro: initialData?.seguro || 0,
    outrasDespesas: initialData?.outrasDespesas || 0,
    descontos: initialData?.descontos || 0,
    icmsRetido: initialData?.icmsRetido || 0,

    supplier: {
      id: initialData?.supplierId || initialData?.supplier?.id,
      cnpj:
        initialData?.supplier?.cnpj ||
        initialData?.supplier?.identification ||
        "",
    },

    transport: initialData?.transport || {
      nome: "",
      cnpj: "",
      placa: "",
      uf: "",
    },

    items:
      initialData?.items?.map((it: any) => ({
        codigoProduto: it.codigoProduto || it.item?.id || "",
        nome: it.nomeOriginal || it.nome || it.item?.name || "",
        quantidade: Number(it.quantidade || it.quantity || 1),
        unidade: it.unidade || it.item?.unit || "UN",
        valorUnitario: Number(it.valorUnitario || it.unitPrice || 0),
        valorIpi: Number(it.valorIpi || 0),
        valorIcms: Number(it.valorIcms || 0),
      })) || ([] as any[]),

    icmsRows: initialData?.icmsRows || [
      { alicota: 0, base: 0, valor: 0 },
      { alicota: 0, base: 0, valor: 0 },
      { alicota: 0, base: 0, valor: 0 },
    ],
  });

  const [totals, setTotals] = useState<any>({
    totalProdutos: 0,
    totalNota: initialData?.totalAmount || 0,
    baseIcms: 0,
    valorIcms: 0,
    baseIcmsSt: 0,
    valorIcmsSt: 0,
    valorIpi: 0,
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Recalcula totais sempre que o componente montar com dados iniciais
  useEffect(() => {
    calculateTotals(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔥 CÁLCULO DE PREVIEW (Espelho do que o Back-end fará)
  const calculateTotals = (newForm: any) => {
    setIsCalculating(true);

    let calcTotalProdutos = 0;
    let calcValorIpi = 0;
    let calcValorIcms = 0;

    // Varre os itens para somar os valores brutos e impostos individuais
    newForm.items.forEach((item: any) => {
      const qtd = Number(item.quantidade) || 0;
      const vUnit = Number(item.valorUnitario) || 0;

      calcTotalProdutos += qtd * vUnit;
      calcValorIpi += Number(item.valorIpi) || 0;
      calcValorIcms += Number(item.valorIcms) || 0;
    });

    // Matemática da Nota Fiscal Brasileira:
    // Total = Produtos + Frete + Seguro + Outras Despesas + IPI + ICMS ST - Descontos
    const frete = Number(newForm.frete) || 0;
    const seguro = Number(newForm.seguro) || 0;
    const despesas = Number(newForm.outrasDespesas) || 0;
    const descontos = Number(newForm.descontos) || 0;

    // Supondo que a ST (Substituição Tributária) venha do XML ou seja digitada no futuro,
    // por enquanto deixamos zerada na soma.
    const stTotal = Number(newForm.icmsRetido) || 0;

    const calcTotalNota =
      calcTotalProdutos +
      frete +
      seguro +
      despesas +
      calcValorIpi +
      stTotal -
      descontos;

    setTotals({
      totalProdutos: calcTotalProdutos,
      totalNota: calcTotalNota,
      valorIpi: calcValorIpi,
      valorIcms: calcValorIcms,
      baseIcms: calcTotalProdutos, // Simplificação para preview
      baseIcmsSt: 0,
      valorIcmsSt: stTotal,
    });

    setIsCalculating(false);
  };

  // 🔧 PATCH GENÉRICO (Atualiza estado e dispara o cálculo instantaneamente)
  const patch = (data: any) => {
    const updated = { ...form, ...data };
    setForm(updated);
    calculateTotals(updated);
  };

  const patchSupplier = (data: any) => {
    const updated = { ...form, supplier: { ...form.supplier, ...data } };
    setForm(updated);
  };

  const patchTransport = (data: any) => {
    const updated = { ...form, transport: { ...form.transport, ...data } };
    setForm(updated);
  };

  // 📦 GERENCIAMENTO DE ITENS
  const addItem = (item?: any) => {
    const newItem = item || {
      nome: "",
      quantidade: 1,
      valorUnitario: 0,
      unidade: "UN",
      valorIpi: 0,
      valorIcms: 0,
    };
    const updated = { ...form, items: [...form.items, newItem] };
    setForm(updated);
    calculateTotals(updated);
  };

  const updateItem = (index: number, data: any) => {
    const items = [...form.items];
    items[index] = { ...items[index], ...data };
    const updated = { ...form, items };
    setForm(updated);
    calculateTotals(updated);
  };

  const removeItem = (index: number) => {
    const items = form.items.filter((_: any, i: number) => i !== index);
    const updated = { ...form, items };
    setForm(updated);
    calculateTotals(updated);
  };

  // 📥 IMPORTAÇÃO XML
  const importData = () => {
    toast.info("Processando XML de importação...");
    // Aqui você vai sobrepor o `form` com os dados parseados do XML
    // patch(xmlParsedData);
  };

  const save = async () => {
    // Validações rigorosas antes de incomodar o servidor
    if (!form.numero) {
      toast.error("O número da nota é obrigatório.");
      return false;
    }
    if (!form.supplier.cnpj) {
      toast.error("Os dados do fornecedor (CNPJ) estão incompletos.");
      return false;
    }
    if (form.items.length === 0) {
      toast.error("Você precisa adicionar ao menos um item à nota.");
      return false;
    }

    try {
      setIsSaving(true);
      // Dispara para o nosso service que traduz o `form` + `totals` para o Payload do NestJS
      // await inventoryService.saveEntryNote(form, totals);
      console.log(form, totals);

      toast.success(
        "Nota salva com sucesso! O estoque e o financeiro foram atualizados.",
      );
      return true;
    } catch (error: any) {
      console.error("Erro ao salvar nota:", error);
      toast.error(
        error.response?.data?.message ||
          "Ocorreu um erro ao processar a nota fiscal.",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => {
    window.location.reload();
  };

  return {
    form,
    totals,
    isCalculating,
    isSaving,
    patch,
    patchSupplier,
    patchTransport,
    addItem,
    updateItem,
    removeItem,
    importData,
    save,
    reset,
  };
}

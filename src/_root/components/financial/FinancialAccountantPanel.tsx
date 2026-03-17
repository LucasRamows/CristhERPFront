import { CheckCircle, DownloadCloud, FileSpreadsheet } from "lucide-react";
import { useState } from "react";

export function FinancialAccountantPanel() {
  const [exportState, setExportState] = useState<
    "idle" | "processing" | "success"
  >("idle");

  const handleExport = () => {
    setExportState("processing");
    setTimeout(() => {
      setExportState("success");
      setTimeout(() => setExportState("idle"), 3000); // Reseta após 3s
    }, 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto h-full flex flex-col justify-center animate-fade-in pt-12 md:pt-16">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-[#E2F898] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <FileSpreadsheet size={40} className="text-gray-900" />
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-4">
          Fechamento do Mês
        </h2>
        <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
          Agrupe todos os XMLs de notas (Entrada e Saída) e o arquivo SPED
          Fiscal em um único ZIP para enviar ao seu contador.
        </p>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-200 shadow-xl p-8 md:p-12">
        <div className="mb-8 border-b border-gray-100 pb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
              Mês de Referência
            </span>
            <select className="bg-gray-50 border border-gray-200 text-xl font-black text-gray-900 rounded-2xl px-6 py-4 outline-none focus:border-[#44A08D]">
              <option>Agosto 2023</option>
              <option>Setembro 2023</option>
              <option>Outubro 2023</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
              <span className="block text-2xl font-black text-[#44A08D]">
                842
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase">
                NFC-e Emitidas
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
              <span className="block text-2xl font-black text-red-500">24</span>
              <span className="text-xs font-bold text-gray-500 uppercase">
                NF-e de Entrada
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <label className="flex items-center p-5 border-2 border-[#E2F898] bg-[#E2F898]/10 rounded-2xl cursor-pointer hover:bg-[#E2F898]/20 transition-colors">
            <input
              type="checkbox"
              defaultChecked
              className="w-6 h-6 rounded text-gray-900 focus:ring-[#E2F898] accent-gray-900"
            />
            <span className="ml-4 font-bold text-lg text-gray-900">
              XMLs Notas de Saída (Vendas)
            </span>
          </label>
          <label className="flex items-center p-5 border-2 border-[#E2F898] bg-[#E2F898]/10 rounded-2xl cursor-pointer hover:bg-[#E2F898]/20 transition-colors">
            <input
              type="checkbox"
              defaultChecked
              className="w-6 h-6 rounded text-gray-900 focus:ring-[#E2F898] accent-gray-900"
            />
            <span className="ml-4 font-bold text-lg text-gray-900">
              XMLs Notas de Entrada (Compras)
            </span>
          </label>
          <label className="flex items-center p-5 border-2 border-[#E2F898] bg-[#E2F898]/10 rounded-2xl cursor-pointer hover:bg-[#E2F898]/20 transition-colors">
            <input
              type="checkbox"
              defaultChecked
              className="w-6 h-6 rounded text-gray-900 focus:ring-[#E2F898] accent-gray-900"
            />
            <span className="ml-4 font-bold text-lg text-gray-900">
              Arquivo SPED Fiscal
            </span>
          </label>
          <label className="flex items-center p-5 border-2 border-[#E2F898] bg-[#E2F898]/10 rounded-2xl cursor-pointer hover:bg-[#E2F898]/20 transition-colors">
            <input
              type="checkbox"
              defaultChecked
              className="w-6 h-6 rounded text-gray-900 focus:ring-[#E2F898] accent-gray-900"
            />
            <span className="ml-4 font-bold text-lg text-gray-900">
              Relatório Resumo em PDF
            </span>
          </label>
        </div>

        {exportState === "idle" && (
          <button
            onClick={handleExport}
            className="w-full bg-gray-900 text-white font-black text-2xl py-6 rounded-3xl hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            <DownloadCloud size={28} /> Gerar ZIP e Enviar
          </button>
        )}

        {exportState === "processing" && (
          <button
            disabled
            className="w-full bg-gray-200 text-gray-500 font-black text-2xl py-6 rounded-3xl flex items-center justify-center gap-3"
          >
            <div className="w-8 h-8 border-4 border-gray-400 border-t-gray-800 rounded-full animate-spin"></div>{" "}
            Compactando arquivos...
          </button>
        )}

        {exportState === "success" && (
          <button className="w-full bg-[#44A08D] text-white font-black text-2xl py-6 rounded-3xl flex items-center justify-center gap-3 animate-fade-in shadow-xl">
            <CheckCircle size={28} /> Arquivos Enviados com Sucesso!
          </button>
        )}
      </div>
    </div>
  );
}

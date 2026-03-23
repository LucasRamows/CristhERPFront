import { CheckCircle, DollarSign, Package, UploadCloud, XCircle } from "lucide-react";

interface XmlImportProps {
  xmlState: "idle" | "uploading" | "success";
  onFileUpload: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function XmlImport({ xmlState, onFileUpload, onCancel, onConfirm }: XmlImportProps) {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto h-full flex flex-col justify-center animate-in fade-in slide-in-from-top-10 duration-500 pt-12 md:pt-20">
      {xmlState === "idle" && (
        <div
          onClick={onFileUpload}
          className="w-full relative group"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-primary/20 rounded-[50px] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
          <div className="relative w-full border-4 border-dashed border-gray-200 bg-white/50 backdrop-blur-sm rounded-[44px] p-24 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/50 transition-all group-hover:scale-[1.02] shadow-sm">
            <div className="w-28 h-28 bg-gray-50 border border-gray-100 rounded-[40px] flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-500 group-hover:bg-emerald-500 group-hover:text-white text-gray-300 group-hover:rotate-6 group-hover:shadow-2xl">
              <UploadCloud size={56} />
            </div>
            <h2 className="text-4xl font-black text-gray-800 mb-6 tracking-tight">
              Importar Nota Fiscal (XML)
            </h2>
            <p className="text-gray-400 font-bold text-xl max-w-sm leading-relaxed">
              Arraste o arquivo XML do seu fornecedor ou clique para selecionar. O sistema fará o cruzamento inteligente.
            </p>
          </div>
        </div>
      )}

      {xmlState === "uploading" && (
        <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500">
           <div className="relative w-32 h-32 mb-12">
            <div className="absolute inset-0 border-8 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-transparent border-t-emerald-500 border-l-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-4 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-black">
              Lendo...
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-800 mb-3 tracking-tight">
            Processando XML...
          </h3>
          <p className="text-gray-400 font-bold text-lg animate-pulse">
            Consultando SEFAZ e cruzando dados do estoque
          </p>
        </div>
      )}

      {xmlState === "success" && (
        <div className="bg-white rounded-[44px] border border-gray-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-w-3xl mx-auto border-t-8 border-emerald-500">
          <div className="bg-emerald-500 p-10 text-white flex items-center gap-8">
            <div className="w-20 h-20 bg-white/20 rounded-[28px] flex items-center justify-center backdrop-blur-md border border-white/30 rotate-3 shadow-xl">
              <CheckCircle size={42} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight leading-none mb-2">
                Nota Processada!
              </h2>
              <p className="text-white/80 font-bold text-lg">
                NFe nº 598210 - Distribuidora Alimentos S/A
              </p>
              <span className="inline-flex mt-3 h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <span className="h-full w-full bg-white rounded-full"></span>
              </span>
            </div>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-50/50">
            {/* Card Atualização de Estoque */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3 text-emerald-600 font-black uppercase tracking-widest text-xs">
                <Package size={20} /> Estoque a Receber
              </div>
              <ul className="space-y-4">
                <li className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                  <span className="font-bold text-gray-700">Filé Mignon</span>{" "}
                  <span className="text-emerald-600 font-black text-xl">+25 kg</span>
                </li>
                <li className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                  <span className="font-bold text-gray-700">Salmão Fresco</span>{" "}
                  <span className="text-emerald-600 font-black text-xl">+15 kg</span>
                </li>
                <li className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                  <span className="font-bold text-gray-700">Cerveja</span>{" "}
                  <span className="text-emerald-600 font-black text-xl">+100 un</span>
                </li>
              </ul>
            </div>

            {/* Card Lançamento Financeiro */}
            <div className="bg-red-50/50 p-8 rounded-[32px] border border-red-100/50 flex flex-col gap-6">
              <div className="flex items-center gap-3 text-red-800 font-black uppercase tracking-widest text-xs">
                <DollarSign size={20} /> Fluxo de Caixa
              </div>

              <div>
                <span className="block text-gray-400 font-black text-[10px] uppercase tracking-widest mb-2">
                  Valor Total Lançado
                </span>
                <span className="text-5xl font-black text-gray-900 leading-none">
                   <span className="text-xl mr-1 font-black opacity-30">R$</span>
                  3.868,50
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-50">
                <span className="block text-[10px] font-black text-red-400 mb-1 uppercase tracking-widest">
                  Vencimento Boleto
                </span>
                <span className="font-black text-gray-800 text-lg">
                  15 / Setembro / 2026
                </span>
              </div>
            </div>
          </div>

          <div className="p-10 bg-white flex gap-5 border-t border-gray-100">
            <button
              onClick={onCancel}
              className="px-8 py-5 rounded-3xl font-black text-lg text-gray-400 hover:bg-gray-100 transition-colors flex items-center gap-2 border border-transparent hover:border-gray-200"
            >
              <XCircle size={22} /> Cancelar
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 bg-gray-900 text-primary font-black text-2xl py-5 rounded-3xl hover:bg-emerald-600 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 group"
            >
              <CheckCircle size={28} className="group-hover:scale-125 transition-transform" /> Confirmar Entrada
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

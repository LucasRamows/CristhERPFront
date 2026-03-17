// import {
//   AlertCircle,
//   ArrowRight,
//   Calculator,
//   CheckCircle,
//   DollarSign,
//   Package,
//   ShoppingCart,
//   UploadCloud
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import {
//   PageTabNavigation,
//   type TabItem,
// } from "../../components/shared/PageTabNavigation";

// // --- CONFIGURAÇÃO DE ESTILO E CORES ---
// const COLORS = {
//   bg: "#F3F4F6",
//   primary: "#E2F898", // Verde Lima
//   accentPink: "#FFD1CD", // Rosa suave
//   accentTeal: "#44A08D", // Verde escuro
//   text: "#111827",
//   textLight: "#6B7280",
// };

// // --- DADOS MOCKADOS ---
// const MOCK_ESTOQUE = [
//   {
//     id: 1,
//     insumo: "Filé Mignon (kg)",
//     atual: 12,
//     mediaDiaria: 5,
//     minimo: 15,
//     un: "kg",
//   },
//   {
//     id: 2,
//     insumo: "Salmão Fresco (kg)",
//     atual: 4,
//     mediaDiaria: 3,
//     minimo: 10,
//     un: "kg",
//   },
//   {
//     id: 3,
//     insumo: "Cerveja Artesanal (Lata)",
//     atual: 24,
//     mediaDiaria: 30,
//     minimo: 60,
//     un: "un",
//   },
//   {
//     id: 4,
//     insumo: "Batata Frita Congelada (kg)",
//     atual: 45,
//     mediaDiaria: 10,
//     minimo: 30,
//     un: "kg",
//   },
//   {
//     id: 5,
//     insumo: "Óleo de Soja (L)",
//     atual: 8,
//     mediaDiaria: 4,
//     minimo: 15,
//     un: "L",
//   },
// ];

// const MOCK_COTACAO = [
//   {
//     id: 1,
//     insumo: "Filé Mignon (kg)",
//     qtdSugestao: 25,
//     fornecedores: { A: 68.9, B: 65.5, C: 70.0 },
//   },
//   {
//     id: 2,
//     insumo: "Salmão Fresco (kg)",
//     qtdSugestao: 15,
//     fornecedores: { A: 85.0, B: 89.9, C: 82.5 },
//   },
//   {
//     id: 3,
//     insumo: "Cerveja Artesanal (Lata)",
//     qtdSugestao: 100,
//     fornecedores: { A: 8.5, B: 8.5, C: 8.2 },
//   },
// ];

export default function SupplyManagementPage() {
  // const [activeView, setActiveView] = useState("sugestoes"); // "sugestoes" | "cotacao" | "xml"

  // // Estados para simulação da Entrada de XML
  // const [xmlState, setXmlState] = useState("idle"); // 'idle' | 'uploading' | 'success'

  // // Simula o processamento do XML
  // const handleFileUpload = () => {
  //   setXmlState("uploading");
  //   setTimeout(() => {
  //     setXmlState("success");
  //   }, 1500);
  // };

  // const inventoryTabs: TabItem[] = [
  //   { id: "sugestoes", label: "Sugestões", icon: ShoppingCart },
  //   { id: "cotacao", label: "Cotação Inteligente", icon: Calculator },
  //   { id: "xml", label: "Entrada XML", icon: UploadCloud, highlight: true },
  // ];

  // // --- RENDERIZADORES AUXILIARES ---

  // // Calcula a sugestão de compra (Para 7 dias de cobertura)
  // const calcularSugestao = (item: any) => {
  //   const coberturaDesejada = 7; // dias
  //   const necessidade = item.mediaDiaria * coberturaDesejada;
  //   const sugestao = necessidade - item.atual;
  //   return sugestao > 0 ? sugestao : 0;
  // };

  // // Encontra o menor preço na cotação
  // // const getMelhorPreco = (fornecedores: any) => {
  // //   return Math.min(...Object.values(fornecedores));
  // // };

  return (
    // <div className="flex gap-4 flex-col w-full bg-background overflow-hidden select-none">
    //   {/* Toggle Switch Navigation */}
    //   <PageTabNavigation
    //     tabs={inventoryTabs}
    //     activeTab={activeView}
    //     onTabChange={setActiveView}
    //     className="w-full md:w-fit"
    //   />
    //   {/* WRAPPER PRINCIPAL */}
    //   <div className="flex flex-col h-full w-full overflow-hidden bg-card rounded-2xl">
    //     {/* ÁREA DE CONTEÚDO DINÂMICO */}
    //     <div className="flex-1 overflow-y-auto bg-gray-50/50 relative custom-scrollbar">
    //       {/* VISÃO 1: SUGESTÃO DE COMPRAS */}
    //       {activeView === "sugestoes" && (
    //         <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in">
    //           <div className="mb-8">
    //             <h2 className="text-2xl font-black text-gray-800">
    //               Sugestão de Compras (Reposição)
    //             </h2>
    //             <p className="text-gray-500 font-medium">
    //               Baseado na média de vendas dos últimos 15 dias vs Estoque
    //               atual.
    //             </p>
    //           </div>

    //           <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden">
    //             <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-100 bg-gray-50 text-gray-500 font-bold text-sm uppercase tracking-wider">
    //               <div className="col-span-5">Insumo</div>
    //               <div className="col-span-2 text-center">Estoque Atual</div>
    //               <div className="col-span-2 text-center">Média / Dia</div>
    //               <div className="col-span-3 text-right">Comprar (7 dias)</div>
    //             </div>

    //             <div className="flex flex-col">
    //               {MOCK_ESTOQUE.map((item, index) => {
    //                 const sugestao = calcularSugestao(item);
    //                 const critico = item.atual <= item.mediaDiaria * 2; // Crítico se durar 2 dias ou menos

    //                 return (
    //                   <div
    //                     key={item.id}
    //                     className={`grid grid-cols-12 gap-4 p-6 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
    //                       critico ? "bg-[#FFD1CD]/10" : ""
    //                     }`}
    //                   >
    //                     <div className="col-span-5 flex items-center gap-3">
    //                       <div
    //                         className={`w-10 h-10 rounded-full flex items-center justify-center ${
    //                           critico
    //                             ? "bg-[#FFD1CD] text-red-700"
    //                             : "bg-gray-100 text-gray-500"
    //                         }`}
    //                       >
    //                         {critico ? (
    //                           <AlertCircle size={20} />
    //                         ) : (
    //                           <Package size={20} />
    //                         )}
    //                       </div>
    //                       <span className="font-extrabold text-lg">
    //                         {item.insumo}
    //                       </span>
    //                     </div>

    //                     <div className="col-span-2 text-center">
    //                       <span
    //                         className={`font-bold text-lg ${
    //                           critico ? "text-red-500" : "text-gray-700"
    //                         }`}
    //                       >
    //                         {item.atual} {item.un}
    //                       </span>
    //                     </div>

    //                     <div className="col-span-2 text-center font-bold text-gray-500">
    //                       {item.mediaDiaria} {item.un}/dia
    //                     </div>

    //                     <div className="col-span-3 flex justify-end">
    //                       {sugestao > 0 ? (
    //                         <div className="bg-[#E2F898] text-gray-900 px-4 py-2 rounded-xl font-black text-lg shadow-sm">
    //                           +{sugestao} {item.un}
    //                         </div>
    //                       ) : (
    //                         <div className="text-gray-400 font-bold px-4 py-2">
    //                           OK
    //                         </div>
    //                       )}
    //                     </div>
    //                   </div>
    //                 );
    //               })}
    //             </div>
    //           </div>

    //           <div className="mt-6 flex justify-end">
    //             <button
    //               onClick={() => setActiveView("cotacao")}
    //               className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
    //             >
    //               Gerar Cotação Destes Itens <ArrowRight size={20} />
    //             </button>
    //           </div>
    //         </div>
    //       )}

    //       {/* VISÃO 2: COTAÇÃO INTELIGENTE */}
    //       {activeView === "cotacao" && (
    //         <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in">
    //           <div className="mb-8 flex justify-between items-end">
    //             <div>
    //               <h2 className="text-2xl font-black text-gray-800">
    //                 Cotação Inteligente
    //               </h2>
    //               <p className="text-gray-500 font-medium">
    //                 Preencha os valores. O sistema destaca a opção mais barata
    //                 automaticamente.
    //               </p>
    //             </div>
    //             <div className="flex gap-4">
    //               <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
    //                 <div className="w-4 h-4 rounded bg-[#E2F898]"></div> Menor
    //                 Preço
    //               </div>
    //             </div>
    //           </div>

    //           <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden">
    //             <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-100 bg-gray-50 text-gray-500 font-bold text-sm uppercase tracking-wider">
    //               <div className="col-span-4">Insumo a Comprar</div>
    //               <div className="col-span-2 text-center text-[#44A08D]">
    //                 Atacadão
    //               </div>
    //               <div className="col-span-2 text-center text-[#44A08D]">
    //                 Makro
    //               </div>
    //               <div className="col-span-2 text-center text-[#44A08D]">
    //                 Distrib. Local
    //               </div>
    //               <div className="col-span-2 text-right">Melhor Opção</div>
    //             </div>

    //             <div className="flex flex-col">
    //               {MOCK_COTACAO.map((item) => {
    //                 // const melhorPreco = getMelhorPreco(item.fornecedores);
    //                 return (
    //                   <div
    //                     key={item.id}
    //                     className="grid grid-cols-12 gap-4 p-6 items-center border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
    //                   >
    //                     <div className="col-span-4 pr-4">
    //                       <span className="font-extrabold text-lg block leading-tight">
    //                         {item.insumo}
    //                       </span>
    //                       <span className="text-gray-400 font-bold text-sm">
    //                         Qtd Sugerida: {item.qtdSugestao}
    //                       </span>
    //                     </div>

    //                     {/* Colunas de Fornecedores */}
    //                     {["A", "B", "C"].map((forn) => {
    //                       // const preco = item.fornecedores[forn];
    //                       // const isMelhor = preco === melhorPreco;
    //                       return (
    //                         <div key={forn} className="col-span-2 px-2">
    //                           <div
    //                             className={`relative w-full px-4 py-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
    //                               // isMelhor
    //                               //   ? "bg-[#E2F898] border-[#E2F898] shadow-sm"
    //                               //   : "bg-white border-gray-200"
    //                             }`}
    //                           >
    //                             <span
    //                               className={`text-sm font-bold ${
    //                                 // isMelhor ? "text-gray-900" : "text-gray-400"
    //                               }`}
    //                             >
    //                               R$
    //                             </span>
    //                             <span
    //                               className={`text-xl font-black ${
    //                                 // isMelhor ? "text-gray-900" : "text-gray-700"
    //                               }`}
    //                             >
    //                               {/* {preco.toFixed(2)} */}
    //                             </span>
    //                           </div>
    //                         </div>
    //                       );
    //                     })}

    //                     <div className="col-span-2 flex justify-end items-center">
    //                       <div className="text-right">
    //                         <span className="block text-xs font-bold text-gray-400 uppercase">
    //                           Subtotal Melhor
    //                         </span>
    //                         <span className="text-2xl font-black text-[#44A08D]">
    //                           R$ {(melhorPreco * item.qtdSugestao).toFixed(2)}
    //                         </span>
    //                       </div>
    //                     </div>
    //                   </div>
    //                 );
    //               })}
    //             </div>

    //             {/* Rodapé Resumo Cotação */}
    //             <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
    //               <div>
    //                 <h3 className="text-gray-400 font-bold uppercase tracking-wider text-sm mb-1">
    //                   Resumo da Cotação
    //                 </h3>
    //                 <p className="text-xl font-medium">
    //                   Comprando pelo menor preço por item
    //                 </p>
    //               </div>
    //               <div className="text-right flex items-center gap-6">
    //                 <span className="text-5xl font-black text-[#E2F898]">
    //                   R$ 3.868,50
    //                 </span>
    //                 <button className="bg-white text-gray-900 px-6 py-4 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all active:scale-95">
    //                   Gerar Pedidos
    //                 </button>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       )}

    //       {/* VISÃO 3: ENTRADA DE XML */}
    //       {activeView === "xml" && (
    //         <div className="p-4 md:p-8 max-w-4xl mx-auto h-full flex flex-col justify-center animate-fade-in pt-12 md:pt-20">
    //           {xmlState === "idle" && (
    //             <div
    //               onClick={handleFileUpload}
    //               className="w-full border-4 border-dashed border-gray-300 rounded-[40px] p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#44A08D] hover:bg-[#44A08D]/5 transition-all group"
    //             >
    //               <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-[#44A08D] group-hover:text-white text-gray-400">
    //                 <UploadCloud size={48} />
    //               </div>
    //               <h2 className="text-3xl font-black text-gray-800 mb-4">
    //                 Importar Nota Fiscal (XML)
    //               </h2>
    //               <p className="text-gray-500 font-medium text-lg max-w-md">
    //                 Arraste o arquivo XML do seu fornecedor aqui ou clique para
    //                 selecionar. O sistema fará o resto.
    //               </p>
    //             </div>
    //           )}

    //           {xmlState === "uploading" && (
    //             <div className="flex flex-col items-center justify-center py-20 animate-pulse">
    //               <div className="w-20 h-20 border-8 border-gray-200 border-t-[#44A08D] rounded-full animate-spin mb-8"></div>
    //               <h3 className="text-2xl font-black text-gray-800">
    //                 Lendo XML...
    //               </h3>
    //               <p className="text-gray-500 font-medium mt-2">
    //                 Cruzando itens com o estoque atual
    //               </p>
    //             </div>
    //           )}

    //           {xmlState === "success" && (
    //             <div className="bg-white rounded-[40px] border border-gray-200 shadow-xl overflow-hidden animate-fade-in">
    //               <div className="bg-[#44A08D] p-8 text-white flex items-center gap-6">
    //                 <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
    //                   <CheckCircle size={32} className="text-white" />
    //                 </div>
    //                 <div>
    //                   <h2 className="text-2xl font-black">
    //                     Nota Processada com Sucesso!
    //                   </h2>
    //                   <p className="text-white/80 font-medium text-lg mt-1">
    //                     NFe nº 598210 - Distribuidora Alimentos S/A
    //                   </p>
    //                 </div>
    //               </div>

    //               <div className="p-8 grid grid-cols-2 gap-8">
    //                 {/* Card Atualização de Estoque */}
    //                 <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100">
    //                   <div className="flex items-center gap-3 text-gray-500 font-bold mb-4 uppercase tracking-wider text-sm">
    //                     <Package size={20} /> Estoque a ser atualizado
    //                   </div>
    //                   <ul className="space-y-3">
    //                     <li className="flex justify-between font-bold text-gray-800 text-lg">
    //                       <span>Filé Mignon</span>{" "}
    //                       <span className="text-[#44A08D]">+25 kg</span>
    //                     </li>
    //                     <li className="flex justify-between font-bold text-gray-800 text-lg">
    //                       <span>Salmão Fresco</span>{" "}
    //                       <span className="text-[#44A08D]">+15 kg</span>
    //                     </li>
    //                     <li className="flex justify-between font-bold text-gray-800 text-lg">
    //                       <span>Cerveja Artesanal</span>{" "}
    //                       <span className="text-[#44A08D]">+100 un</span>
    //                     </li>
    //                   </ul>
    //                 </div>

    //                 {/* Card Lançamento Financeiro */}
    //                 <div className="bg-[#FFD1CD]/20 p-6 rounded-[24px] border border-[#FFD1CD]/50">
    //                   <div className="flex items-center gap-3 text-red-800 font-bold mb-4 uppercase tracking-wider text-sm">
    //                     <DollarSign size={20} /> Lançar em Contas a Pagar
    //                   </div>

    //                   <div className="mb-4">
    //                     <span className="block text-gray-500 font-medium mb-1">
    //                       Valor Total da Nota
    //                     </span>
    //                     <span className="text-4xl font-black text-gray-900">
    //                       R$ 3.868,50
    //                     </span>
    //                   </div>

    //                   <div className="bg-white p-4 rounded-xl shadow-sm">
    //                     <span className="block text-sm font-bold text-gray-400 mb-1">
    //                       Vencimento Lido (Boleto)
    //                     </span>
    //                     <span className="font-bold text-gray-800">
    //                       15 de Setembro de 2026
    //                     </span>
    //                   </div>
    //                 </div>
    //               </div>

    //               <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
    //                 <button
    //                   onClick={() => setXmlState("idle")}
    //                   className="px-8 py-5 rounded-2xl font-bold text-lg text-gray-500 hover:bg-gray-200 transition-colors"
    //                 >
    //                   Cancelar
    //                 </button>
    //                 <button className="flex-1 bg-[#E2F898] text-gray-900 font-black text-xl py-5 rounded-2xl hover:brightness-95 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2">
    //                   <CheckCircle size={24} /> Confirmar Entrada no Sistema
    //                 </button>
    //               </div>
    //             </div>
    //           )}
    //         </div>
    //       )}
    //     </div>
    //   </div>

    //   {/* --- ESTILOS E ANIMAÇÕES --- */}
    //   <style
    //     dangerouslySetInnerHTML={{
    //       __html: `
    //     @keyframes fadeIn { 
    //       from { opacity: 0; transform: translateY(10px); } 
    //       to { opacity: 1; transform: translateY(0); } 
    //     }
    //     .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        
    //     .hide-scrollbar::-webkit-scrollbar { display: none; }
    //     .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
    //     .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    //     .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    //     .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
    //     .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
    //   `,
    //     }}
    //   />
    // </div>
    <div className="">

    </div>
  );
}

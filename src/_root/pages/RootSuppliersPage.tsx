// import {
//   ChevronRight, Loader2,
//   MapPin,
//   Phone,
//   Plus,
//   Search,
//   Star, TrendingUp
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import apiBack from "../../api/apiBackEnd";
// import { useAuthenticatedUser } from "../../contexts/DataContext";

const RootSuppliersPage = () => {
  //   const [isPanelOpen, setIsPanelOpen] = useState(false);

  //   const [isPanelEditOpen, setIsPanelEditOpen] = useState(false);
  //   const [isLoading, setIsLoading] = useState(true);
  //   const [searchTerm, setSearchTerm] = useState("");
  //   const [suppliers, setSuppliers] = useState<any[]>([]);
  //   const [supplierSelected, setSupplierSelected] = useState<any>();
  //   const [categories, setCategories] = useState(["TODOS"]);
  //   const [selectedCategory, setSelectedCategory] = useState("TODOS");
  //   const { data } = useAuthenticatedUser();

  //   useEffect(() => {
  //     const fetchSuppliers = async () => {
  //       try {
  //         const res: any = await apiBack.get(`/business/${data.business.id}/suppliers`);
  //         setSuppliers(res.data.suppliers);
  //         setCategories(["TODOS", ...res.data.categories]);
  //         setIsLoading(false);
  //       } catch (error) {
  //         console.error("Erro:", error);
  //         setIsLoading(false);
  //       }
  //     };
  //     fetchSuppliers();
  //   }, [data.business.id]);

  //   const filteredSuppliers = suppliers.filter((s) => {
  //     const matchesCategory = selectedCategory === "TODOS" ? true : s.category === selectedCategory;
  //     const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.document.includes(searchTerm);
  //     return matchesCategory && matchesSearch;
  //   });

  //   if (isLoading) {
  //     return (
  //       <div className="h-screen w-full flex items-center justify-center">
  //         <Loader2 className="h-10 w-10 animate-spin text-chart-2" />
  //       </div>
  //     );
  //   }

  return (
    //     <div className="flex bg-background overflow-hidden">
    //       <div className="flex-1 flex flex-col overflow-y-auto">

    //         <header className="flex flex-col gap-6">
    //           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-foreground">
    //             <div>
    //               <h1 className="text-2xl font-black text-primary tracking-tight">
    //                 Rede de Fornecedores
    //               </h1>
    //               <p className="text-muted-foreground text-sm font-medium">
    //                 Gerencie fornecedores de resíduos e outros itens.
    //               </p>
    //             </div>
    //             <button
    //               onClick={() => setIsPanelOpen(true)}
    //               className="bg-primary hover:bg-primary/90 text-secondary px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
    //             >
    //               <Plus size={20} strokeWidth={3} />
    //               NOVO FORNECEDOR
    //             </button>
    //           </div>

    //           {/* 2. MINI DASHBOARD DE FORNECEDORES (BENTO STYLE) */}
    //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //             <div className="bg-muted/50 p-4 rounded-3xl border border-foreground/5 flex items-center gap-4">
    //               <div className="w-12 h-12 bg-chart-1/20 rounded-2xl flex items-center justify-center text-chart-1"><Star size={24} /></div>
    //               <div>
    //                 <p className="text-[10px] font-black text-muted-foreground uppercase">Principais Fornecedores</p>
    //                 <p className="text-xl font-black text-primary">12 Ativos</p>
    //               </div>
    //             </div>
    //             <div className="bg-muted/50 p-4 rounded-3xl border border-foreground/5 flex items-center gap-4">
    //               <div className="w-12 h-12 bg-chart-2/20 rounded-2xl flex items-center justify-center text-chart-2"><TrendingUp size={24} /></div>
    //               <div>
    //                 <p className="text-[10px] font-black text-muted-foreground uppercase">Volume Mensal</p>
    //                 <p className="text-xl font-black text-primary">145.2 Ton</p>
    //               </div>
    //             </div>
    //             <div className="bg-muted/50 p-4 rounded-3xl border border-foreground/5 flex items-center gap-4">
    //               <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500"><MapPin size={24} /></div>
    //               <div>
    //                 <p className="text-[10px] font-black text-muted-foreground uppercase">Cidades Atendidas</p>
    //                 <p className="text-xl font-black text-primary">8 Regiões</p>
    //               </div>
    //             </div>
    //           </div>

    //           {/* 3. FILTROS E BUSCA */}
    //           <div className="flex flex-col md:flex-row gap-4">
    //             <div className="relative flex-1 group">
    //               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
    //               <input
    //                 type="text"
    //                 placeholder="Buscar por nome, CPF ou CNPJ..."
    //                 className="w-full pl-12 pr-4 py-4 bg-muted border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
    //                 onChange={(e) => setSearchTerm(e.target.value)}
    //               />
    //             </div>
    //             <div className="flex gap-2 overflow-x-auto no-scrollbar">
    //               {categories.map((cat) => (
    //                 <button
    //                   key={cat}
    //                   onClick={() => setSelectedCategory(cat)}
    //                   className={`px-6 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all uppercase ${
    //                     selectedCategory === cat ? "bg-primary text-secondary" : "bg-muted text-muted-foreground hover:bg-muted/80"
    //                   }`}
    //                 >
    //                   {cat}
    //                 </button>
    //               ))}
    //             </div>
    //           </div>
    //         </header>

    //         {/* 4. LISTA DE CARDS (STYLE IFOOD PRO) */}
    //         <main className="grid gap-4">
    //           {filteredSuppliers.length > 0 ? (
    //             filteredSuppliers.map((item) => (
    //               <div
    //                 key={item.id}
    //                 onClick={() => { setSupplierSelected(item); setIsPanelEditOpen(true); }}
    //                 className="group bg-muted/30 hover:bg-muted/60 border border-foreground/5 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between transition-all cursor-pointer"
    //               >
    //                 <div className="flex items-center gap-6">
    //                   {/* Avatar com Letra */}
    //                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner ${
    //                     item.type === 'PJ' ? 'bg-primary text-secondary' : 'bg-chart-2 text-primary'
    //                   }`}>
    //                     {item.name.charAt(0)}
    //                   </div>

    //                   <div>
    //                     <div className="flex items-center gap-2">
    //                       <h3 className="font-black text-primary text-xl tracking-tight">{item.name}</h3>
    //                       <span className="text-[10px] bg-background px-2 py-0.5 rounded-md font-black text-muted-foreground border border-foreground/10">{item.type}</span>
    //                     </div>
    //                     <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
    //                       <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-bold tracking-tight">
    //                         <Phone size={14} className="text-primary/60" /> {item.phone}
    //                       </div>
    //                       <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-bold tracking-tight">
    //                         <MapPin size={14} className="text-primary/60" /> {item.city}
    //                       </div>
    //                       <div className="flex items-center gap-1.5 text-chart-2 text-sm font-black italic">
    //                         <Star size={14} fill="currentColor" /> {item.category}
    //                       </div>
    //                     </div>
    //                   </div>
    //                 </div>

    //                 <div className="flex items-center justify-between md:justify-end gap-8 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-foreground/5">
    //                   <div className="text-right">
    //                     <p className="text-[10px] font-black text-muted-foreground uppercase">Acumulado</p>
    //                     <p className="text-lg font-black text-primary">8.420 <span className="text-xs">kg</span></p>
    //                   </div>
    //                   <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center group-hover:bg-primary group-hover:text-secondary transition-all">
    //                     <ChevronRight size={20} />
    //                   </div>
    //                 </div>
    //               </div>
    //             ))
    //           ) : (
    //             // <div className="py-20 flex flex-col items-center opacity-40">
    //             //   <building2 size={60} strokeWidth={1} />
    //             //   <p className="mt-4 font-bold italic tracking-tight">Nenhum parceiro encontrado nesta categoria.</p>
    //             // </div>
    //             <></>
    //           )}
    //         </main>

    //         {/* PAINEIS LATERAIS (Mantendo sua lógica de Slide-over) */}
    //         {/* ... (os condicionais isPanelOpen e isPanelEditOpen que você já tem) */}
    //       </div>
    //     </div>
    <div className=""></div>
  );
};

export default RootSuppliersPage;

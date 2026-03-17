// import {
//   Briefcase,
//   Download,
//   Filter,
//   Minus,
//   MoreHorizontal,
//   Plus,
//   Search,
//   Users,
//   Wallet,
// } from "lucide-react";
// import { useState } from "react";
// import { Button } from "../../components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "../../components/ui/sheet";
// import EmployerForm from "../forms/RootEmployerForm";
// const INITIAL_EMPLOYEES = [
//   {
//     id: 1,
//     name: "Antônio Silva",
//     email: "antonio.silva@attos.com",
//     role: "Prensista",
//     status: "Ativo",
//     salary: 2200.0,
//     balance: 950.0,
//     admissionDate: "05/01/2023",
//     photo:
//       "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop",
//     history: [
//       { id: 1, type: "bonus", desc: "Meta Semanal", value: 200, date: "12/02" },
//       { id: 2, type: "vale", desc: "Adiantamento", value: -100, date: "10/02" },
//     ],
//   },
//   {
//     id: 2,
//     name: "Marcos Oliveira",
//     email: "marcos.oli@attos.com",
//     role: "Motorista",
//     status: "Ativo",
//     salary: 2800.0,
//     balance: 2800.0,
//     admissionDate: "15/03/2022",
//     photo:
//       "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
//     history: [],
//   },
//   {
//     id: 3,
//     name: "Ana Souza",
//     email: "ana.souza@attos.com",
//     role: "Triagem",
//     status: "Férias",
//     salary: 1800.0,
//     balance: 1650.0,
//     admissionDate: "20/06/2023",
//     photo:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
//     history: [
//       {
//         id: 1,
//         type: "falta",
//         desc: "Falta Injust.",
//         value: -150,
//         date: "01/02",
//       },
//     ],
//   },
// ];

const RootHRPage = () => {
  //   const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  //   const [searchTerm, setSearchTerm] = useState("");
  //   const [isSheetOpen, setIsSheetOpen] = useState(false);
  //   const [sheetType, setSheetType] = useState(""); // 'add_employee' | 'transaction'
  //   const [selectedEmpId, setSelectedEmpId] = useState(null);

  //   // States
  //   const [inputValue, setInputValue] = useState("");
  //   const [inputDesc, setInputDesc] = useState("");
  //   const [newEmployeeForm, setNewEmployeeForm] = useState({
  //     name: "",
  //     cpf: "",
  //     rg: "",
  //     birthDate: "",
  //     phone: "",
  //     photoUrl: "",
  //     contractType: "CLT",
  //     role: "",
  //     salary: "",
  //     pixKey: "",
  //     admissionDate: "",
  //     epiSize: "",
  //     trainings: "",
  //     shift: "",
  //     address: "",
  //     radius: "",
  //   });

  //   // KPI Calculations
  //   const totalEmployees = employees.length;
  //   const totalBalance = employees.reduce(
  //     (acc: any, emp: any) => acc + emp.balance,
  //     0,
  //   );
  //   const totalPayroll = employees.reduce(
  //     (acc: any, emp: any) => acc + emp.salary,
  //     0,
  //   );
  //   const filteredEmployees = employees.filter(
  //     (emp: any) =>
  //       emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       emp.role.toLowerCase().includes(searchTerm.toLowerCase()),
  //   );

  //   // Handlers
  //   const openSheet = (type: any, empId = null) => {
  //     setSheetType(type);
  //     setSelectedEmpId(empId);
  //     setInputValue("");
  //     setInputDesc("");

  //     if (type === "add_employee") {
  //       setNewEmployeeForm({
  //         name: "",
  //         cpf: "",
  //         rg: "",
  //         birthDate: "",
  //         phone: "",
  //         photoUrl: "",
  //         contractType: "CLT",
  //         role: "",
  //         salary: "",
  //         pixKey: "",
  //         admissionDate: "",
  //         epiSize: "",
  //         trainings: "",
  //         shift: "",
  //         address: "",
  //         radius: "",
  //       });
  //     } else {
  //       // Quick actions logic (Falta/Pay) or open sheet for value input
  //       if (type === "falta") {
  //         handleFalta(empId);
  //         return;
  //       }
  //       if (type === "pay") {
  //         handlePayment(empId);
  //         return;
  //       }
  //     }
  //     setIsSheetOpen(true);
  //   };

  //   // const handleTransaction = () => {
  //   //   if (!inputValue) return;
  //   //   setEmployees((prev: any) =>
  //   //     prev.map((emp: any) => {
  //   //       if (emp.id === selectedEmpId) {
  //   //         const val = parseFloat(inputValue);
  //   //         let newBalance = emp.balance;
  //   //         let signal = 1;
  //   //         if (sheetType === "vale") {
  //   //           newBalance -= val;
  //   //           signal = -1;
  //   //         } else if (sheetType === "bonus") {
  //   //           newBalance += val;
  //   //         }

  //   //         const newHistory = {
  //   //           id: Date.now(),
  //   //           type: sheetType,
  //   //           desc: inputDesc || (sheetType === "vale" ? "Vale" : "Bônus"),
  //   //           value: val * signal,
  //   //           date: new Date().toLocaleDateString("pt-BR", {
  //   //             day: "2-digit",
  //   //             month: "2-digit",
  //   //           }),
  //   //         };
  //   //         return {
  //   //           ...emp,
  //   //           balance: newBalance,
  //   //           history: [newHistory, ...emp.history],
  //   //         };
  //   //       }
  //   //       return emp;
  //   //     }),
  //   //   );
  //   //   setIsSheetOpen(false);
  //   // };

  //   const handleFalta = (empId: any) => {
  //     if (!window.confirm("Confirmar falta?")) return;
  //     setEmployees((prev: any) =>
  //       prev.map((emp: any) => {
  //         if (emp.id === empId) {
  //           const dayValue = emp.salary / 30;
  //           const newHistory = {
  //             id: Date.now(),
  //             type: "falta",
  //             desc: "Falta/DSR",
  //             value: -dayValue,
  //             date: new Date().toLocaleDateString("pt-BR", {
  //               day: "2-digit",
  //               month: "2-digit",
  //             }),
  //           };
  //           return {
  //             ...emp,
  //             balance: emp.balance - dayValue,
  //             history: [newHistory, ...emp.history],
  //           };
  //         }
  //         return emp;
  //       }),
  //     );
  //   };

  //   const handlePayment = (empId: any) => {
  //     if (!window.confirm("Quitar saldo total?")) return;
  //     setEmployees((prev: any) =>
  //       prev.map((emp: any) => {
  //         if (emp.id === empId) {
  //           const newHistory = {
  //             id: Date.now(),
  //             type: "payment",
  //             desc: "Quitação",
  //             value: -emp.balance,
  //             date: new Date().toLocaleDateString("pt-BR", {
  //               day: "2-digit",
  //               month: "2-digit",
  //             }),
  //           };
  //           return { ...emp, balance: 0, history: [newHistory, ...emp.history] };
  //         }
  //         return emp;
  //       }),
  //     );
  //   };

  //   // const handleAddEmployee = () => {
  //   //   if (!newEmployeeForm.name || !newEmployeeForm.salary) {
  //   //     alert("Preencha nome e salário.");
  //   //     return;
  //   //   }
  //   //   const newEmp = {
  //   //     id: Date.now(),
  //   //     name: newEmployeeForm.name,
  //   //     role: newEmployeeForm.role || "Colaborador",
  //   //     status: "Ativo",
  //   //     salary: parseFloat(newEmployeeForm.salary),
  //   //     balance: parseFloat(newEmployeeForm.salary),
  //   //     admissionDate:
  //   //       newEmployeeForm.admissionDate || new Date().toLocaleDateString("pt-BR"),
  //   //     photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  //   //     history: [],
  //   //     details: { ...newEmployeeForm },
  //   //   };
  //   //   // setEmployees([...employees, newEmp]);
  //   //   setIsSheetOpen(false);
  //   // };

  //   return (
  //     <div className="space-y-3 bg-background">
  //       <div className="space-y-6">
  //         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  //           <div>
  //             <h1 className="text-2xl font-black text-primary tracking-tight">
  //               GESTÃO DE COLABORADORES
  //             </h1>
  //             <p className="text-muted-foreground text-sm font-medium">
  //               Visão geral da equipe e controle financeiro.
  //             </p>
  //           </div>

  //           <div className="flex items-center gap-3">
  //             <Button variant="outline" className=" font-bold gap-2">
  //               <Download size={18} /> EXPORTAR
  //             </Button>

  //             <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
  //               <SheetTrigger asChild>
  //                 <Button className="font-black gap-2 bg-primary text-secondary hover:bg-primary/90 shadow-lg">
  //                   <Plus size={20} strokeWidth={3} /> ADICIONAR COLABORADOR
  //                 </Button>
  //               </SheetTrigger>
  //               <SheetContent className="sm:max-w-135 overflow-y-auto bg-background border-l-foreground/10">
  //                 <SheetHeader className="mb-8">
  //                   <SheetTitle className="text-2xl font-black uppercase tracking-tighter">
  //                     Novo Colaborador
  //                   </SheetTitle>
  //                   <SheetDescription className="font-medium italic">
  //                     Preencha os dados abaixo.
  //                   </SheetDescription>
  //                 </SheetHeader>
  //                 <EmployerForm onSubmit={handleFalta} />
  //               </SheetContent>
  //             </Sheet>
  //           </div>
  //         </div>

  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //           <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow">
  //             <div className="flex justify-between items-start mb-2">
  //               <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
  //                 Total Equipe
  //               </p>
  //               <Users size={16} className="text-zinc-400" />
  //             </div>
  //             <div className="text-3xl font-bold text-zinc-900">
  //               {totalEmployees}
  //             </div>
  //           </div>
  //           <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow">
  //             <div className="flex justify-between items-start mb-2">
  //               <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
  //                 Folha Mensal
  //               </p>
  //               <Briefcase size={16} className="text-zinc-400" />
  //             </div>
  //             <div className="text-3xl font-bold text-zinc-900">
  //               R${" "}
  //               {totalPayroll.toLocaleString("pt-BR", {
  //                 minimumFractionDigits: 2,
  //               })}
  //             </div>
  //           </div>
  //           <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow">
  //             <div className="flex justify-between items-start mb-2">
  //               <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
  //                 Saldo Pendente
  //               </p>
  //               <Wallet size={16} className="text-zinc-400" />
  //             </div>
  //             <div className="text-3xl font-bold text-primary">
  //               R${" "}
  //               {totalBalance.toLocaleString("pt-BR", {
  //                 minimumFractionDigits: 2,
  //               })}
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
  //         <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
  //           <div className="relative w-full sm:w-80">
  //             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
  //             <input
  //               placeholder="Filtrar colaboradores..."
  //               value={searchTerm}
  //               onChange={(e) => setSearchTerm(e.target.value)}
  //               className="h-9 w-full rounded-md border border-zinc-200 bg-transparent pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
  //             />
  //           </div>
  //           <div className="flex gap-2">
  //             <button className="h-9 px-3 border border-dashed border-zinc-300 rounded-md text-sm font-medium text-zinc-600 hover:bg-zinc-50 flex items-center gap-2">
  //               <Filter size={14} /> Filtros
  //             </button>
  //           </div>
  //         </div>

  //         <div className="overflow-x-auto">
  //           <table className="w-full text-sm text-left">
  //             <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-200">
  //               <tr>
  //                 <th className="h-10 px-4 pl-6">Colaborador</th>
  //                 <th className="h-10 px-4">Cargo</th>
  //                 <th className="h-10 px-4">Status</th>
  //                 <th className="h-10 px-4 text-right">Salário Base</th>
  //                 <th className="h-10 px-4 text-right">Saldo Atual</th>
  //                 <th className="h-10 px-4 w-[50px]"></th>
  //               </tr>
  //             </thead>
  //             <tbody className="divide-y divide-zinc-100">
  //               {filteredEmployees.map((emp: any) => (
  //                 <tr
  //                   key={emp.id}
  //                   className="hover:bg-zinc-50/50 transition-colors group"
  //                 >
  //                   <td className="p-4 pl-6">
  //                     <div className="flex items-center gap-3">
  //                       <img
  //                         src={emp.photo}
  //                         alt=""
  //                         className="h-8 w-8 rounded-full object-cover border border-zinc-200"
  //                       />
  //                       <div>
  //                         <div className="font-medium text-zinc-900">
  //                           {emp.name}
  //                         </div>
  //                         <div className="text-xs text-zinc-500">
  //                           {emp.email || "N/A"}
  //                         </div>
  //                       </div>
  //                     </div>
  //                   </td>
  //                   <td className="p-4 text-zinc-600">{emp.role}</td>
  //                   <td className="p-4">
  //                     <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
  //                       Ativo
  //                     </span>
  //                   </td>
  //                   <td className="p-4 text-right text-zinc-600">
  //                     R${" "}
  //                     {emp.salary.toLocaleString("pt-BR", {
  //                       minimumFractionDigits: 2,
  //                     })}
  //                   </td>
  //                   <td className="p-4 text-right font-bold text-zinc-900">
  //                     R${" "}
  //                     {emp.balance.toLocaleString("pt-BR", {
  //                       minimumFractionDigits: 2,
  //                     })}
  //                   </td>
  //                   <td className="p-4 text-right">
  //                     <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
  //                       <button
  //                         onClick={() => openSheet("vale", emp.id)}
  //                         title="Vale"
  //                         className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-zinc-100 text-zinc-500"
  //                       >
  //                         <Minus size={14} />
  //                       </button>
  //                       <button
  //                         onClick={() => openSheet("bonus", emp.id)}
  //                         title="Bônus"
  //                         className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-zinc-100 text-zinc-500"
  //                       >
  //                         <Plus size={14} />
  //                       </button>
  //                       <button
  //                         title="Mais"
  //                         className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-zinc-100 text-zinc-500"
  //                       >
  //                         <MoreHorizontal size={14} />
  //                       </button>
  //                     </div>
  //                   </td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //       </div>
  //     </div>
  //   );
  return <div className=""></div>;
};

export default RootHRPage;

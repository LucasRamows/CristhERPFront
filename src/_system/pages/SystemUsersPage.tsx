import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";

export default function SystemUsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Usuários do Sistema
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gerencie os usuários e seus acessos ao painel Master.
          </p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20">
              <Plus className="mr-2 h-4 w-4" /> Cadastrar Usuário
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[400px] sm:w-[540px] p-0 flex flex-col h-full z-100"
          >
            <SheetHeader className="p-6 border-b border-zinc-200">
              <SheetTitle>Cadastrar Novo Usuário</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
        <p className="text-sm text-zinc-500 font-medium">
          Lista de usuários será exibida aqui futuramente...
        </p>
      </div>
    </div>
  );
}

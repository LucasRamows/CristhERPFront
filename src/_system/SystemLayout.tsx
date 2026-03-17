import {
  Building,
  ChevronDown,
  HelpCircle,
  LogOut,
  Settings,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useAuthenticatedUser } from "../contexts/DataContext";
import { useRedirectIfPublic } from "../lib/handleRedirect";

const SystemLayout = () => {
  const { data, logout } = useAuthenticatedUser();
  const navigate = useNavigate();
  const redirectIfPublic = useRedirectIfPublic();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-background flex flex-col font-sans min-h-screen">
      {/* Header Específico do Sistema */}
      <header className="bg-white border-b border-zinc-200 h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-50 shadow-sm">
        <button
          type="button"
          onClick={() => redirectIfPublic(data.role)}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-emerald-600/20">
              <img src="/logo.png" alt="logo" className="w-full" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-zinc-900 tracking-tight leading-none text-lg">
                Attos<span className="font-light text-zinc-500">System</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider leading-none mt-0.5">
                Administração
              </span>
            </div>
          </div>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-1.5 rounded-xl transition-all border border-transparent hover:bg-zinc-50 hover:border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500/10 data-[state=open]:bg-zinc-50 data-[state=open]:border-zinc-200">
              {/* Informações do Usuário (Desktop) */}
              <div className="hidden sm:flex flex-col text-right mr-1">
                <span className="text-xs font-bold text-zinc-900">
                  {data?.name || "Usuário Master"}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium uppercase">
                  {data?.role || "Master"}
                </span>
              </div>

              {/* Avatar / Ícone */}
              <div className="w-9 h-9 bg-zinc-100 border border-zinc-200 rounded-full flex items-center justify-center text-zinc-500 shadow-inner">
                <Building size={18} />
              </div>

              {/* Chevron com rotação automática controlada pelo componente */}
              <ChevronDown
                size={14}
                className="text-zinc-400 transition-transform duration-200 mr-1 group-data-[state=open]:rotate-180"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{data?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {data?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  navigate("users", { replace: true });
                }}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Gestão de Usuários</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Ajuda e Suporte</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair da Conta</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 w-full p-4 sm:p-6 bg-zinc-50/50">
        <Outlet />
      </main>

      {/* Footer Simples */}
      <footer className="py-6 text-center text-xs text-zinc-400 border-t border-zinc-200 bg-white">
        © 2024 Attos Green Tecnologia
      </footer>
    </div>
  );
};

export default SystemLayout;

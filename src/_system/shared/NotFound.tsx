import { FileQuestion, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import SystemFooterComponent from "../components/SystemFooterComponent";

const NotFound = () => {
  const navigate = useNavigate();

  const handleRedirectIfPublic = () => {
    navigate("/sign-in", { replace: true });
  };
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-emerald-200 rounded-3xl rotate-6 opacity-20 group-hover:rotate-12 transition-transform duration-500"></div>
        <div className="relative w-24 h-24 bg-white border border-zinc-100 rounded-3xl flex items-center justify-center shadow-xl shadow-zinc-200/50">
          <FileQuestion
            size={48}
            className="text-emerald-600"
            strokeWidth={1.5}
          />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-3">
        Página não encontrada
      </h1>
      <p className="text-zinc-500 max-w-sm mb-8 leading-relaxed text-sm">
        O caminho que você tentou acessar não existe ou foi movido. Verifique a
        URL ou retorne para a área segura.
      </p>
      <Button
        onClick={() => handleRedirectIfPublic()}
        className="h-12 px-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-sm shadow-xl shadow-zinc-900/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <Home size={18} />
        Voltar ao Início
      </Button>
      <SystemFooterComponent />
    </div>
  );
};

export default NotFound;

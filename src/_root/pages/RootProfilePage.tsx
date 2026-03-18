import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  User
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { useAuthenticatedUser } from "../../contexts/DataContext";
import { userService } from "../../services/user/user.service";

const RootProfilePage: React.FC = () => {
  const { data: user, refreshData } = useAuthenticatedUser();

  // Estados Locais
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sincronizar se o usuário mudar externamente
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("O nome não pode estar vazio.");
      return;
    }

    try {
      setIsSaving(true);
      const payload: any = { name };

      if (password.trim() !== "") {
        if (password.length < 6) {
          toast.error("A senha deve ter pelo menos 6 caracteres.");
          setIsSaving(false);
          return;
        }
        payload.password = password;
      }

      await userService.updateProfile(user.id, payload);
      await refreshData();

      toast.success("Perfil atualizado com sucesso!");
      setPassword(""); // Limpa a senha após sucesso
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Falha ao atualizar perfil. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex gap-4 flex-col w-full bg-background overflow-hidden select-none">
      {/* Informações Básicas */}
      <section className="bg-card border border-border rounded-[2rem] p-8 space-y-8">
        <div className="flex items-center gap-3">
          <User size={20} className="text-primary" />
          <h3 className="font-neusharp italic uppercase text-lg">
            Dados Pessoais
          </h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">
              Seu Nome
            </label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                <User size={18} />
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-secondary/30 border border-border rounded-2xl py-4 pl-14 pr-4 focus:outline-none focus:border-primary/50 focus:bg-secondary/50 font-bold transition-all"
                placeholder="Seu nome completo"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">
              E-mail (Não Alterável)
            </label>
            <div className="relative group opacity-60">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                <Mail size={18} />
              </div>
              <input
                readOnly
                value={user?.email || ""}
                className="w-full bg-secondary/10 border border-border dashed rounded-2xl py-4 pl-14 pr-4 text-muted-foreground cursor-not-allowed font-medium select-none"
              />
              <Lock
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/30"
                size={14}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Segurança */}
      <section className="bg-card border border-border rounded-[2rem] p-8 space-y-8">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-primary" />
          <h3 className="font-neusharp italic uppercase text-lg">Segurança</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">
              Mudar Senha
            </label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Deixe em branco para não alterar"
                className="w-full bg-secondary/30 border border-border rounded-2xl py-4 pl-14 pr-14 focus:outline-none focus:border-primary/50 focus:bg-secondary/50 font-bold transition-all placeholder:font-medium placeholder:text-muted-foreground/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ação Principal */}
      <div className="pt-4">
        <Button
          onClick={handleUpdate}
          disabled={isSaving || (name === user?.name && !password)}
          className="w-full rounded-[2rem] bg-primary text-primary-foreground font-black uppercase tracking-widest h-16 hover:opacity-90 shadow-xl shadow-primary/20 transition-all border-none flex items-center justify-center gap-3 text-sm"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Atualizando...
            </>
          ) : (
            <>
              <Save size={20} />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </main>
  );
};

export default RootProfilePage;

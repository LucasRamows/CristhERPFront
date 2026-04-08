import { Bell, LayoutGrid, Moon, Palette, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { useAuthenticatedUser } from "../../contexts/DataContext";
import { restaurantService } from "../../services/restaurant/restaurant.service";
import { useTheme } from "../../contexts/ThemeContext";

const RootSettingsPage: React.FC = () => {
  const { data: user, refreshData } = useAuthenticatedUser();
  const [themeToggle, setThemeToggle] = useState(false);
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [totalTables, setTotalTables] = useState(
    user?.restaurant?.totalTables || 10,
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toggleTheme } = useTheme();
  const onThemeChange = () => {
    setThemeToggle((prev) => !prev);
    toggleTheme();
  };

  // Sincronizar estado local se o usuário mudar externamente
  useEffect(() => {
    if (user?.restaurant?.totalTables) {
      setTotalTables(user.restaurant.totalTables);
    }
  }, [user?.restaurant?.totalTables]);

  const handleSaveTables = async () => {
    try {
      setIsSaving(true);
      await restaurantService.updateTables(totalTables);
      await refreshData();
      toast.success("Quantidade de mesas atualizada!");
    } catch (error) {
      console.error("Erro ao salvar mesas:", error);
      toast.error("Erro ao atualizar mesas. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex gap-4 flex-col w-full bg-background overflow-hidden select-none">
      {/* Tema */}
      <section className="bg-card border border-border rounded-[2rem] p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Palette size={20} className="text-primary" />
          <h3 className="uppercase text-lg">Tema</h3>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Mudar tema
          </span>
          <button
            onClick={onThemeChange}
            className={`w-14 h-8 rounded-full transition-all relative flex items-center ${
              themeToggle ? "bg-primary" : "bg-secondary"
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all flex items-center justify-center ${
                themeToggle ? "left-7" : "left-1"
              }`}
            >
              {themeToggle ? (
                <Moon size={14} className="text-gray-800" />
              ) : (
                <Sun size={14} className="text-yellow-500" />
              )}
            </div>
          </button>
        </div>
      </section>

      {/* Notificações */}
      <section className="bg-card border border-border rounded-[2rem] p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-primary" />
          <h3 className="uppercase text-lg">Alertas e Avisos</h3>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Receber avisos no sistema
          </span>
          <button
            onClick={() => setReceiveNotifications(!receiveNotifications)}
            className={`w-14 h-8 rounded-full transition-all relative ${
              receiveNotifications ? "bg-primary" : "bg-secondary"
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${
                receiveNotifications ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </section>

      {/* Quantidade de Mesas */}
      <section className="bg-card border border-border rounded-[2rem] p-8 space-y-6">
        <div className="flex items-center gap-3">
          <LayoutGrid size={20} className="text-primary" />
          <h3 className="uppercase text-lg">Ambiente e Mesas</h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest leading-none">
              Quantidade de Mesas
            </span>
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
              Total de mesas disponíveis no salão e PDV
            </p>
          </div>

          <div className="flex items-center gap-4 bg-secondary/10 p-2 rounded-2xl border border-border/50">
            <button
              onClick={() => setTotalTables(Math.max(1, totalTables - 1))}
              className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center font-bold hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
            >
              -
            </button>
            <div className="w-12 text-center text-xl font-bold">
              {totalTables}
            </div>
            <button
              onClick={() => setTotalTables(totalTables + 1)}
              className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center font-bold hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleSaveTables}
            disabled={isSaving || totalTables === user?.restaurant?.totalTables}
            className="w-full rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest h-14 hover:opacity-90 shadow-lg shadow-primary/20 transition-all border-none"
          >
            {isSaving ? "Atualizando..." : "Salvar Alteração"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default RootSettingsPage;
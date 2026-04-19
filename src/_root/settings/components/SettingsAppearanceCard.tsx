import { Bell, Moon, Palette, Sun } from "lucide-react";
import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  receiveNotifications: boolean;
  setReceiveNotifications: (val: boolean) => void;
}

export const SettingsAppearanceCard: React.FC<Props> = ({
  receiveNotifications,
  setReceiveNotifications,
}) => {
  const { theme, toggleTheme } = useTheme();
  const themeToggle = theme === "dark";

  return (
    <section className="bg-card border border-border rounded-[2rem] p-6 sm:p-8 space-y-8 shadow-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Palette size={20} className="text-primary" />
        </div>
        <h3 className="uppercase text-lg font-bold tracking-tight">
          Aparência & Alertas
        </h3>
      </div>

      <div className="flex items-center justify-between group">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold uppercase tracking-widest">
            Modo Escuro
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">
            Alterne entre tema claro e escuro
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className={`w-14 h-8 rounded-full transition-colors relative flex items-center shadow-innerF`}
        >
          <div
            className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all flex items-center justify-center`}
          >
            {themeToggle ? (
              <Moon size={14} className="text-slate-800" />
            ) : (
              <Sun size={14} className="text-yellow-500" />
            )}
          </div>
        </button>
      </div>

      <div className="flex items-center justify-between group">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold uppercase tracking-widest">
            Alertas do Sistema
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">
            Receber avisos e atualizações
          </span>
        </div>
        <button
          onClick={() => setReceiveNotifications(!receiveNotifications)}
          className={`w-14 h-8 rounded-full transition-colors relative shadow-inner ${
            receiveNotifications ? "bg-primary" : "bg-muted-foreground/30"
          }`}
        >
          <div
            className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all ${
              receiveNotifications ? "left-7" : "left-1"
            }`}
          >
            {receiveNotifications && (
              <Bell
                size={12}
                className="text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            )}
          </div>
        </button>
      </div>
    </section>
  );
};

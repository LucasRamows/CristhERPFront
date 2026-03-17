import { useState } from "react";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { SystemInput } from "./SystemInput";
import apiBack from "../../services/api";

export function SecuritySettingsCard() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSavePassword() {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("A nova senha e a confirmação não coincidem.");
      return;
    }

    setIsSavingPassword(true);
    try {
      await apiBack.patch(`/auth/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      await new Promise((resolve) => setTimeout(resolve, 800));

      alert("Senha alterada com sucesso!");
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      alert("Houve um problema ao alterar a senha. Verifique a senha atual.");
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-red-100 dark:border-red-900/30 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex flex-wrap items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
          <Lock size={18} className="text-red-600 dark:text-red-400" />{" "}
          Segurança e Senha
        </h2>
        {!isChangingPassword && (
          <button
            onClick={() => setIsChangingPassword(true)}
            className="text-sm px-4 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
          >
            Alterar Senha
          </button>
        )}
      </div>

      {isChangingPassword && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-red-50 dark:border-red-900/10 animate-fade-in">
          <div className="md:col-span-2">
            <SystemInput
              label="Senha Atual"
              type={showPassword ? "text" : "password"}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <SystemInput
            label="Nova Senha"
            type={showPassword ? "text" : "password"}
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
          <SystemInput
            label="Confirme a Nova Senha"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
          />

          <div className="md:col-span-2 flex items-center justify-between mt-2 flex-wrap gap-4">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPassword ? "Ocultar Senhas" : "Mostrar Senhas"}
            </button>

            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="flex-1 md:flex-none px-4 py-2 text-sm rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePassword}
                disabled={isSavingPassword || !passwordData.newPassword}
                className="flex-1 md:flex-none px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSavingPassword && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                Atualizar Senha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api"; // ATENÇÃO: Importe a sua configuração do Axios aqui
import type { ClassItem } from "../_root/components/settings/SettingsDataClassesCard";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OWNER" | "MANAGER" | "CASHIER" | "WAITER";
  restaurantId?: string;
  restaurant?: {
    corporateName: string;
    documentCnpj: string;
    email: string;  
    id: string;
    phone: string;
    plan: string;
    restaurantName: string;
    totalTables: number;
    SupplierCategories: ClassItem[];
    ProductCategories: ClassItem[];
  };  
}

interface DataContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshData: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  getHomePath: (role: User["role"]) => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const refreshData = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
      return response.data;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        await refreshData();
      } catch (error) {
        console.error("Sessão expirada ou não autenticado (sem cookie válido).");
        setUser(null);
      } finally {
        setIsLoading(false); 
      }
    };

    restoreSession();
  }, []);
  const getHomePath = (role: User["role"]) => {
    if (["ADMIN", "OWNER", "MANAGER"].includes(role)) return "/root/dashboard";
    return "/root/sales";
  };

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = ["/sign-in", "/"].includes(location.pathname);

    if (user) {
      if (isPublicRoute) {
        navigate(getHomePath(user.role), { replace: true });
      }
    } else {
      if (!isPublicRoute && !location.pathname.startsWith("/not-authorized")) {
        navigate("/sign-in", { replace: true });
      }
    }
  }, [user, location.pathname, navigate, isLoading]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erro ao fazer logout na API", error);
    } finally {
      setUser(null);
      navigate("/sign-in", { replace: true });
    }
  };

  return (
    <DataContext.Provider
      value={{
        user,
        setUser,
        refreshData,
        isLoading,
        isAuthenticated: !!user,
        logout: handleLogout,
        getHomePath,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData deve ser usado dentro de um DataProvider");
  }
  return context;
};

export const useAuthenticatedUser = () => {
  const data = useData();
  if (!data.user) {
    throw new Error("useAuthenticatedUser foi chamado sem um usuário logado.");
  }

  return { ...data, data: data.user };
};

export default DataProvider;
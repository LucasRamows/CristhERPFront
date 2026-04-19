import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Category } from "../components/shared/CategoryFilter";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OWNER" | "MANAGER" | "CASHIER" | "WAITER";
  businessId?: string;
  business?: {
    id: string;
    businessName: string;
    corporateName: string;
    documentCnpj: string;
    email: string;
    phone: string;
    plan: string;
    businessType: string;
    settings?: {
      TOTAL_TABLES?: number;
      // Você pode adicionar outras chaves aqui no futuro, ex:
      // THEME_MODE?: string;
      [key: string]: any;
    };
    SupplierCategories: Category[];
    ProductCategories: Category[];
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
  updateProductCategoryCount: (
    categoryId: string,
    categoryName: string,
  ) => void;
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
        console.error(
          "Sessão expirada ou não autenticado (sem cookie válido).",
        );
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
  const updateProductCategoryCount = (
    categoryId: string,
    categoryName: string,
  ) => {
    setUser((prevUser) => {
      if (!prevUser || !prevUser.business) return prevUser;

      const currentCategories = prevUser.business.ProductCategories || [];
      const exists = currentCategories.find((c) => c.id === categoryId);

      let newCategories;

      if (exists) {
        newCategories = currentCategories.map((c) =>
          c.id === categoryId
            ? { ...c, _count: { products: (c._count?.products || 0) + 1 } }
            : c,
        );
      } else {
        newCategories = [
          ...currentCategories,
          { id: categoryId, name: categoryName, _count: { products: 1 } },
        ];
      }

      return {
        ...prevUser,
        business: {
          ...prevUser.business,
          ProductCategories: newCategories,
        },
      };
    });
  };
  return (
    <DataContext.Provider
      value={{
        user,
        setUser,
        updateProductCategoryCount,
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
  const context = useData();

  if (!context.user) {
    throw new Error("useAuthenticatedUser foi chamado sem um usuário logado.");
  }

  const user = context.user;
  const business = user.business;
  const settings = business?.settings;

  return {
    ...context, // Mantém logout, refreshData, getHomePath, etc.
    user: user, // O objeto completo, caso precise
    data: user, // Mantendo a compatibilidade (ex: const { data } = useAuthenticatedUser())

    totalTables: settings?.TOTAL_TABLES ?? 24,
    categories: user.business?.ProductCategories ?? [],
    supplierCategories: user.business?.SupplierCategories ?? [],
    businessName: business?.businessName,
    businessPlan: business?.plan,
    businessType: business?.businessType,
    role: user.role,
    updateProductCategoryCount: context.updateProductCategoryCount,
  };
};

export default DataProvider;

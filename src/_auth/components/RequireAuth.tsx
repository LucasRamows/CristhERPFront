import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingComponent from "../../components/shared/LoadingComponent";
import { useData } from "../../contexts/DataContext";

type Role = "ADMIN" | "OWNER" | "MANAGER" | "CASHIER" | "WAITER";

interface RequireAuthProps {
  minRole?: Role;
  onlyRoles?: Role[];
}

const roleLevel: Record<Role, number> = {
  WAITER: 0,
  CASHIER: 1,
  MANAGER: 2,
  OWNER: 3,
  ADMIN: 4,
};

const RequireAuth = ({ minRole, onlyRoles }: RequireAuthProps) => {
  const { user, isLoading, isAuthenticated } = useData();
  const location = useLocation();

  if (isLoading) {
    return <LoadingComponent fullScreen />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (onlyRoles && !onlyRoles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  if (minRole && roleLevel[user.role] < roleLevel[minRole]) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;

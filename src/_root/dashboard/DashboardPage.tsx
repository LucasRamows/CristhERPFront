import LoadingComponent from "../../components/shared/LoadingComponent";
import { useAuthenticatedUser } from "../../contexts/DataContext";
import { DashboardProvider, useDashboard } from "./hooks/DashboardContext";
import { RestaurantDashboard } from "./restaurant/RestaurantDashboard";
import { RetailDashboard } from "./retail/RetailDashboard";


// Criamos um componente interno só para consumir o contexto e decidir a tela
const DashboardContent = () => {
  const { businessType } = useAuthenticatedUser();
  const isRetail = businessType === "RETAIL";
  const { isLoadingData } = useDashboard(); // Consumindo do contexto!

  if (isLoadingData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className="bg-background overflow-hidden select-none w-full h-full">
      {/* Note que não precisamos mais passar as props aqui! */}
      {isRetail ? <RetailDashboard /> : <RestaurantDashboard />}
    </div>
  );
};

const RootDashboardPage = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default RootDashboardPage;
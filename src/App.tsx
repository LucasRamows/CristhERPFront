import { Route, Routes } from "react-router-dom";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";

import RequireAuth from "./_auth/components/RequireAuth";
import { SignInForm } from "./_auth/forms/SigninForm";
import RootDashboardPage from "./_root/dashboard/RootDashboardPage";
import FinancialManagementPage from "./_root/pages/RootFinancialManagementPage";
import RootPassbookPage from "./_root/passbook/RootPassBookPage";
import RootPdvPage from "./_root/pdv/RootPdvPage";
import RootMenuPage from "./_root/products/RootProductsPage";
import RootProfilePage from "./_root/pages/RootProfilePage";
import RootSettingsPage from "./_root/settings/RootSettingsPage";
import RootStaffPage from "./_root/pages/RootStaffPage";
import RootSuppliersPage from "./_root/supplier/RootSuppliersPage";
import SystemLayout from "./_system/SystemLayout";
import SystemUsersPage from "./_system/pages/SystemUsersPage";
import NotAuthorizedPage from "./_system/shared/NotAuthorizedPage";
import NotFound from "./_system/shared/NotFound";
import { AlertProvider } from "./components/shared/AlertProvider";
import DataProvider from "./contexts/DataContext";
import { ThemeProvider } from "./contexts/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <AlertProvider>
        <DataProvider>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/sign-in" element={<SignInForm />} />
            </Route>

            <Route element={<RequireAuth minRole="WAITER" />}>
              <Route path="/root" element={<RootLayout />}>
                <Route path="dashboard" element={<RootDashboardPage />} />
                <Route path="menu" element={<RootMenuPage />} />
                <Route path="supplier" element={<RootSuppliersPage />} />
                <Route element={<RequireAuth minRole="MANAGER" />}>
                  <Route element={<RequireAuth minRole="OWNER" />}>
                    <Route
                      path="financial"
                      element={<FinancialManagementPage />}
                    />
                    <Route path="staff" element={<RootStaffPage />} />
                  </Route>
                </Route>
                <Route path="passbook" element={<RootPassbookPage />} />
                <Route path="sales" element={<RootPdvPage />} />
                <Route path="profile" element={<RootProfilePage />} />
                <Route path="setting" element={<RootSettingsPage />} />
              </Route>
            </Route>

            <Route element={<RequireAuth minRole="ADMIN" />}>
              <Route path="/system" element={<SystemLayout />}>
                <Route path="users" element={<SystemUsersPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
            <Route path="/not-authorized" element={<NotAuthorizedPage />} />
          </Routes>
        </DataProvider>
      </AlertProvider>
    </ThemeProvider>
  );
};

export default App;

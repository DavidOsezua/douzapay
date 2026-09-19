import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup.tsx";
import DashboardLayout from "./pages/dashboard/layout";
import Dashboard from "./pages/dashboard/page";
import Wallet from "./pages/dashboard/wallet/page";
import Shop from "./pages/dashboard/shop/page";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import { handleError } from "./lib/helper";
import AdminDashboardLayout from "./pages/admin-dashboard/layout";
import AdminDashboard from "./pages/admin-dashboard/page";
import Users from "./pages/admin-dashboard/users/page";
import AdminCards from "./pages/admin-dashboard/cards/page";
import TransactionsAdmin from "./pages/admin-dashboard/transactions/page";
import NewUsers from "./pages/admin-dashboard/cards/new-users/page";
import AdminLogin from "./pages/AdminLogin";
import Referrals from "./pages/admin-dashboard/referrals/page";
import ResetPassword from "./pages/ResetPassword";
import Cards from "./pages/dashboard/cards/page";
import CardDetails from "./pages/dashboard/cards/card-details/page";
import Partners from "./pages/dashboard/partners/page";
import Transactions from "./pages/dashboard/transactions/page";
import MyAccount from "./pages/dashboard/account/page";
import Settlements from "./pages/admin-dashboard/settlements/page";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin-dashboard" element={<AdminDashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="cards" element={<AdminCards />} />
        <Route path="cards/new" element={<NewUsers />} />
        <Route path="transactions" element={<TransactionsAdmin />} />
        <Route path="referrals" element={<Referrals />} />
        <Route path="settlements" element={<Settlements />} />
      </Route>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="cards" element={<Cards />} />
        <Route path="cards/:id" element={<CardDetails />} />
        <Route path="partners" element={<Partners />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="shop" element={<Shop />} />
        <Route path="account" element={<MyAccount />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      handleError(error);
    },
  }),
});

function App() {
  return (
    <div className="bg-primary-bg text-primary-500">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
      <Toaster />
    </div>
  );
}

export default App;

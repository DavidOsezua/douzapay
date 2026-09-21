import MobileNav from "@/components/mobileNav";
import AppSidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useGetRecentTransactions, useGetUser } from "@/hooks/use-queries";
import { AuthProvider } from "@/lib/AuthProvider";
import { useUser } from "@/zustand/store";
import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideSheet from "@/components/sheets";
import InternalTransferSheet from "@/components/sheets/internal-transfer-sheet";
import Modal from "@/components/modals/index";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/error-fallback";
import { Loader2 } from "lucide-react";

const DashboardLayout = () => {
  const { data: user, isLoading: loading } = useGetUser();
  const { isLoading: transactionsIsLoading } = useGetRecentTransactions();

  useEffect(() => {
    useUser.setState({ user: user });
    if (user) {
      Sentry.setUser({
        id: user.id,
        username: `${user.firstName} ${user.lastName}`,
        email: user.email,
      });
    }
  }, [user]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="dark">
        <AuthProvider>
          <AnimatePresence>
            {loading || transactionsIsLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
              >
                <div className="flex flex-col items-center gap-4">
                  <img
                    src="/images/full-logo-dark.svg"
                    alt="KrypKard"
                    className="h-10 w-auto"
                  />
                  <Loader2 className="size-7 animate-spin text-[#E1E1E1]" />
                </div>
              </motion.div>
            ) : (
              <SidebarProvider>
                <AppSidebar />
                <MobileNav />
                <main className="bg-dark-background-main relative min-h-dvh w-full pb-20 lg:pb-6">
                  {<Outlet />}
                </main>
                {/* <ChatSupport /> */}
              </SidebarProvider>
            )}
          </AnimatePresence>
          <SideSheet />
          <InternalTransferSheet />
          <Modal />
        </AuthProvider>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardLayout;

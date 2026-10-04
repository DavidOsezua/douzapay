import MobileNav from "@/components/mobileNav";
import AppSidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  useGetRecentTransactions,
  useGetSwaps,
  useGetUser,
} from "@/hooks/use-queries";
import { AuthProvider } from "@/lib/AuthProvider";
import { useUser } from "@/zustand/store";
import { useModalStore } from "@/zustand/modalStore";
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
  const openModal = useModalStore((s) => s.openModal);
  // Loaded up front, like the queries above, so pages that show a Swap tab
  // don't wait on a second fetch, and so the prompt below can react to it.
  const { data: swaps, isLoading: swapsIsLoading } = useGetSwaps();

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

  // If the newest swap is still waiting on the user, put the swap/withdraw
  // choice in front of them. Re-runs whenever the swaps list updates (refetch,
  // focus, another tab's mutation) to reveal a new pending one. Shown at most
  // once per swap, tracked by id in localStorage, so it doesn't reopen every
  // time this effect re-runs for the same swap.
  const isReady = !loading && !transactionsIsLoading && !swapsIsLoading;
  useEffect(() => {
    if (!user || !isReady) return;
    const latest = swaps?.[0];
    if (latest?.status !== "pending") return;
    const SHOWN_KEY = "swap_prompt_last_shown_id";
    try {
      if (localStorage.getItem(SHOWN_KEY) === latest.id) return;
      localStorage.setItem(SHOWN_KEY, latest.id);
    } catch {
      // Private browsing / blocked storage — fall through and show once per
      // session rather than not at all.
    }
    openModal("swapDepositReceived", { swap: latest });
  }, [user, isReady, swaps, openModal]);

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
                    src="/images/duozapay-logo.svg"
                    alt="Duozapay"
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

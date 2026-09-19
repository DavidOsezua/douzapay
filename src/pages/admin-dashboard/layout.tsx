import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./_misc/admin-sidebar";
import TopBar from "./_misc/admin-topbar";
import { Outlet } from "react-router-dom";
import { useAdminModals, useUser } from "@/zustand/store";
import CreateUserModal from "./_misc/modals/create-user";
import { AnimatePresence } from "framer-motion";
import CreateCardModal from "./_misc/modals/create-card";
import EditUserModal from "./_misc/modals/edit-user";
import TransactionDetails from "./_misc/modals/transactionDetails";
import { useGetAdminStats, useGetUser } from "@/hooks/use-queries";
import Throbber from "@/components/throbber";
import DeleteCardModal from "./_misc/modals/delete-card-modal";
import { useEffect } from "react";
import DeleteUserModal from "./_misc/modals/delete-user-modal";
import CardTopupDetails from "./_misc/modals/cardTopupDetails";
import CardSpendingDetails from "./_misc/modals/cardSpendingDetails";
import TransferCommisionModal from "./referrals/_misc/transferCommisionModal";
import CardDetails from "./_misc/modals/cardDetails";
import AssignCardModal from "./_misc/modals/assign-card";
import SideSheet from "@/components/admin-sheets";
import SettlementSideSheet from "@/components/admin-sheets/settlement-details/settlement-sheet";
import AddWalletModal from "./_misc/modals/add-wallet";
import FreezeCardModal from "./_misc/modals/freeze-card-modal";

const DashboardLayout = () => {
  const {
    createUserIsOpen,
    createCardIsOpen,
    assignCardIsOpen,
    editUserIsOpen,
    transactionDetailsIsOpen,
    cardTopupDetailsIsOpen,
    cardSpendingDetailsIsOpen,
    cardDetailsIsOpen,
    deleteUserIsOpen,
    transferCommisionIsOpen,
    addWalletIsOpen,
    deleteCardIsOpen,
    freezeCardIsOpen,
  } = useAdminModals((state) => state);
  const { data: user, isLoading: isUserLoading } = useGetUser();
  const { isLoading: adminStatsLoading } = useGetAdminStats();
  useEffect(() => {
    useUser.setState({ user: user });
  }, [user]);

  return (
    <div className="">
      {adminStatsLoading || isUserLoading ? (
        <div className="flex h-dvh w-full items-center justify-center">
          <Throbber />
        </div>
      ) : (
        <SidebarProvider>
          <AdminSidebar />
          {/* <MobileNav /> */}
          <main className="font-darker min-h-dvh w-full space-y-4 bg-[#E3E8FF] px-4 pt-20 pb-20 md:pt-4 lg:max-w-[calc(100%-var(--sidebar-width))] lg:pb-6">
            <TopBar />
            <Outlet />
          </main>
        </SidebarProvider>
      )}
      <AnimatePresence mode="wait">
        <SideSheet />
        <SettlementSideSheet />
        {createUserIsOpen && <CreateUserModal />}
        {createCardIsOpen && <CreateCardModal />}
        {editUserIsOpen && <EditUserModal />}
        {transactionDetailsIsOpen && <TransactionDetails />}
        {cardTopupDetailsIsOpen && <CardTopupDetails />}
        {cardSpendingDetailsIsOpen && <CardSpendingDetails />}
        {cardDetailsIsOpen && <CardDetails />}
        {deleteCardIsOpen && <DeleteCardModal />}
        {freezeCardIsOpen && <FreezeCardModal />}
        {assignCardIsOpen && <AssignCardModal />}
        {deleteUserIsOpen && <DeleteUserModal />}
        {transferCommisionIsOpen && <TransferCommisionModal />}
        {addWalletIsOpen && <AddWalletModal />}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;

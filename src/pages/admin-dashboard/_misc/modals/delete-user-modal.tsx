import { motion } from "framer-motion";
import { useAdminModals } from "@/zustand/store";
import { useDeleteUserAdmin } from "@/hooks/use-mutations";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Throbber from "@/components/throbber";

const DeleteUserModal = () => {
  const { deleteUserData } = useAdminModals();
  const queryClient = useQueryClient();

  const { mutate: deleteUser, isPending: isDeletingCard } = useDeleteUserAdmin({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      useAdminModals.setState({
        deleteUserIsOpen: false,
        deleteUserData: null,
      });
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-20 flex h-dvh items-center justify-center bg-black/50 backdrop-blur-lg"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="h-auto max-w-100 rounded-2xl bg-white px-4 py-4 lg:w-150"
      >
        <div className="mx-auto text-lg">
          <p className="text-3xl font-bold text-red-500">Delete User</p>
          <p className="text-primary-50 text-sm">
            Are you sure you want to delete this user?
          </p>

          <div className="mt-6 flex gap-4">
            <Button
              variant={"outline"}
              onClick={() =>
                useAdminModals.setState({
                  deleteUserIsOpen: false,
                  deleteUserData: null,
                })
              }
              className="mx-auto w-full rounded-md"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                deleteUser(deleteUserData!.id!);
              }}
              className="mx-auto w-full rounded-md bg-red-500 hover:bg-red-500/90"
            >
              {isDeletingCard ? <Throbber /> : "Delete"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteUserModal;

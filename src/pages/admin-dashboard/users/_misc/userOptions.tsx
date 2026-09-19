import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToggleUserStatus } from "@/hooks/use-mutations";
import { useSheetStore } from "@/zustand/adminSheetStore";
import { useLoadingStore } from "@/zustand/store";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Settings } from "lucide-react";
import { useEffect } from "react";

export const UserStatus = ({ active, id }: { active: boolean; id: string }) => {
  const queryClient = useQueryClient();
  const { mutate: toggleUserStatus, isPending } = useToggleUserStatus({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  useEffect(() => {
    useLoadingStore.setState({ stateIsLoading: isPending });
  }, [isPending]);

  const handleToggleUserStatus = () => {
    toggleUserStatus(id);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex h-auto items-center gap-1 rounded-full p-0 py-1 ${active ? "bg-primary-green/10 text-primary-green" : "bg-primary-red/10 text-primary-red"}`}
        >
          <span className="mb-0.5">{active ? "Active" : "Inactive"} </span>
          <ChevronDown className="w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleToggleUserStatus}>
          {active ? "Deactivate" : "Activate"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const UserSettings = ({ user }: { user: User }) => {
  const { openSheet } = useSheetStore();
  return (
    <Button
      onClick={() => openSheet("settings", null, { userData: user })}
      variant="ghost"
      className="bg-primary-purple/10 text-primary-purple flex h-auto items-center gap-1 rounded-full p-0 py-1"
    >
      <Settings className="size-3" />
      <span className="mb-1">Settings</span>
    </Button>
  );
};

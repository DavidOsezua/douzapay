import { useUser } from "@/zustand/store";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";

const TopBar = () => {
  const navigate = useNavigate();
  const [optionIsOpen, setOptionIsOpen] = useState(false);
  const { user } = useUser((state) => state);

  return (
    <nav className="bg-primary-500 text-primary-100 fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-3 px-4 py-4 md:static md:rounded-lg">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="text-primary-100 hover:bg-white/10 hover:text-primary-100 size-8 shrink-0 md:hidden" />
        <div className="min-w-0 space-y-1">
          <p className="text-base leading-3 md:text-lg">Welcome</p>
          <p className="-my-1.5 truncate py-1.5 text-xl leading-5 font-bold capitalize md:text-3xl md:leading-6">{`${user?.firstName} ${user?.lastName}`}</p>
        </div>
      </div>
      <div className="relative shrink-0">
        <div
          onClick={() => setOptionIsOpen(!optionIsOpen)}
          className="bg-primary-500 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full"
        >
          <span className="bg-primary-50 flex h-8 w-8 items-center justify-center rounded-full text-white">
            {user?.firstName?.substring(0, 1)}
          </span>
        </div>
        {optionIsOpen && (
          <div className="options-menu absolute top-[calc(100%+20px)] right-0 z-[999] min-w-50 rounded-xl bg-white p-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
            <div className="flex items-center gap-2">
              <span className="bg-primary-500 flex h-8 w-8 items-center justify-center rounded-full text-white">
                {user?.firstName?.substring(0, 1)}
              </span>
              <p className="text-primary-500 text-lg font-medium">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <p className="text-primary-500/80 text-sm">{user?.email}</p>

            <div className="bg-primary-bg my-2 h-[1px]" />

            <div
              onClick={() => {
                useUser.setState({ user: null });
                localStorage.removeItem("token");
                toast.success("Logout successful");
                navigate("/login");
              }}
              className="text-primary-500 hover:bg-primary-500/10 -mx-4 flex items-center gap-2 px-4 py-2 text-base font-medium"
            >
              <span>Logout</span> <LogOut className="size-4" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopBar;

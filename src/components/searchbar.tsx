import { useUser } from "@/zustand/store";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SearchBar = () => {
  const [optionIsOpen, setOptionIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser((state) => state);

  const links = [
    {
      title: "Change Login Password",
      path: "/dashboard/change-password",
    },
    {
      title: "Setting 2FA",
      path: "/dashboard/account/2fa",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".options-menu") && !target.closest(".relative")) {
        setOptionIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center space-x-2 rounded-full bg-white p-2">
      <div className="relative">
        <div
          onClick={() => setOptionIsOpen(!optionIsOpen)}
          className="bg-primary-500 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full"
        >
          <span className="bg-primary-500 flex h-8 w-8 items-center justify-center rounded-full text-white">
            {user?.firstName?.substring(0, 1)}
          </span>
        </div>
        {optionIsOpen && (
          <div className="options-menu absolute top-[calc(100%+20px)] right-0 z-[999] min-w-50 rounded-xl bg-white p-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
            <div className="flex items-center gap-2">
              <span className="bg-primary-500 flex h-8 w-8 items-center justify-center rounded-full text-white">
                {user?.firstName?.substring(0, 1)}
              </span>
              <p className="text-lg font-medium">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <p className="text-primary-500/80 text-sm">{user?.email}</p>

            <div className="bg-primary-bg my-2 h-[1px]" />
            <div className="flex flex-col">
              {links.map((link, index) => (
                <Link
                  key={index}
                  className="text-base font-medium"
                  to={link.path}
                >
                  {link.title}
                </Link>
              ))}
            </div>
            <div className="bg-primary-bg my-2 h-[1px]" />

            <div
              onClick={() => {
                useUser.setState({ user: null });
                localStorage.removeItem("token");
                toast.success("Logout successful");
                navigate("/login");
              }}
              className="flex items-center gap-2 text-base font-medium"
            >
              <span>Logout</span> <LogOut className="size-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

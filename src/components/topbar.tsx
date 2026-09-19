import { useUser } from "@/zustand/store";
import { ArrowLeft, LogOut, MessageCircleMore } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useSheetStore } from "@/zustand/sheetStore";
import { useModalStore } from "@/zustand/modalStore";

const TopBar = ({
  title,
  className,
  backTo,
}: {
  title: string;
  className?: string;
  backTo?: string;
}) => {
  const [optionIsOpen, setOptionIsOpen] = useState(false);
  const { user } = useUser((state: any) => state);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const { openSheet } = useSheetStore();
  const { openModal } = useModalStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setOptionIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOptionIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <>
      <nav
        className={`font-poppins bg-dark-background-main border-[#6EF7FF2E] sticky inset-x-0 top-0 z-20 flex w-full max-w-screen items-center justify-between border-b px-4 py-4 text-white lg:px-6 ${className}`}
      >
        <div className="flex items-center gap-2">
          {backTo && (
            <Button
              onClick={() => navigate(backTo)}
              className="size-8"
              variant={"ghost"}
            >
              <ArrowLeft className="text-dark-primary-400" />
            </Button>
          )}
          <p className="text-white text-lg leading-3 font-semibold lg:text-2xl">
            {title}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => openModal("contactUs")}
            className="flex size-8 items-center justify-center rounded-full text-white hover:cursor-pointer hover:opacity-80 active:scale-95 md:size-9 lg:hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
            }}
          >
            <MessageCircleMore className="text-white size-4.5 md:size-6" />
          </button>
          <button
            onClick={() => openSheet("contactUs")}
            className="hidden size-8 items-center justify-center rounded-full text-white hover:cursor-pointer hover:opacity-80 active:scale-95 md:size-9 lg:flex"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
            }}
          >
            <MessageCircleMore className="text-white size-4.5 md:size-6" />
          </button>
          {/* <button className="active:scale-95">
          <img
            className="size-8 md:size-9"
            src="/icons/gradient-notification.svg"
            alt=""
          />
        </button> */}
          <div className="relative">
            <div
              ref={toggleRef}
              onClick={() => setOptionIsOpen(!optionIsOpen)}
              role="button"
              aria-label="Toggle user menu"
              aria-expanded={optionIsOpen}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-white/20 text-[#3FD8E8] transition-all hover:opacity-80 active:scale-90 md:size-9"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
              }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full text-xl font-medium uppercase lg:text-2xl">
                {user?.firstName?.charAt(0)}
              </span>
            </div>

            {optionIsOpen && (
              <div className="options-menu bg-dark-card-3 absolute top-[calc(100%+20px)] right-0 z-20 w-60 overflow-hidden rounded-xl border border-white/10 px-4 pt-4">
                <div
                  ref={menuRef}
                  role="menu"
                  className="flex items-center gap-2"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#3FD8E8]"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
                    }}
                  >
                    {user?.firstName?.charAt(0)}
                  </span>
                  <p className="text-white text-sm">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <p className="text-[#B9BCCC] mt-2 text-xs">{user?.email}</p>

                <div className="my-2 h-[1px] bg-white/10" />

                <div
                  onClick={() => {
                    useUser.setState({ user: undefined });
                    localStorage.removeItem("token");
                    toast.success("Logout successful");
                    navigate("/login");
                  }}
                  className="text-white hover:bg-white/10 -mx-4 flex items-center gap-2 px-4 py-2 text-base font-medium"
                >
                  <span>Logout</span> <LogOut className="size-4" />
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default TopBar;

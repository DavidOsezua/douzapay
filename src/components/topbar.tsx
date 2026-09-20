import { useUser } from "@/zustand/store";
import { ArrowLeft, LogOut, MessageCircleMore } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
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
              <ArrowLeft className="text-[#E1E1E1]" />
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
                "linear-gradient(123.04deg, rgba(167, 167, 167, 0.4) 1.64%, rgba(206, 206, 206, 0.4) 98.52%)",
            }}
          >
            <MessageCircleMore className="text-white size-4.5 md:size-6" />
          </button>
          <button
            onClick={() => openSheet("contactUs")}
            className="hidden size-8 items-center justify-center rounded-full text-white hover:cursor-pointer hover:opacity-80 active:scale-95 md:size-9 lg:flex"
            style={{
              background:
                "linear-gradient(123.04deg, rgba(167, 167, 167, 0.4) 1.64%, rgba(206, 206, 206, 0.4) 98.52%)",
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
              className="text-white flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#CECECE] transition-all hover:opacity-80 active:scale-90 md:size-9"
              style={{
                background:
                  "linear-gradient(129.49deg, rgba(42, 42, 42, 0.5) 3.6%, rgba(28, 28, 28, 0.5) 100%)",
              }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full text-xl font-medium uppercase lg:text-2xl">
                {user?.firstName?.charAt(0)}
              </span>
            </div>

            <AnimatePresence>
              {optionIsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                    y: -8,
                    transition: { duration: 0.15 },
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="options-menu absolute top-[calc(100%+8px)] right-0 z-20 w-60 origin-top-right overflow-hidden rounded-xl border border-white/[0.14] bg-white/10 p-[10px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),inset_1px_0_0_0_rgba(255,255,255,0.12),inset_0_-1px_0_0_rgba(255,255,255,0.05),0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-[7px] backdrop-saturate-[1.6]"
                >
                  <div ref={menuRef} role="menu" className="flex flex-col">
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 28,
                      }}
                      className="flex items-center gap-2 px-[12px] py-[6px]"
                    >
                      <span
                        className="text-white flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#CECECE] uppercase"
                        style={{
                          background:
                            "linear-gradient(129.49deg, rgba(42, 42, 42, 0.5) 3.6%, rgba(28, 28, 28, 0.5) 100%)",
                        }}
                      >
                        {user?.firstName?.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white capitalize">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="truncate text-xs text-white/60">
                          {user?.email}
                        </p>
                      </div>
                    </motion.div>

                    <div className="mx-[6px] my-[4px] h-px bg-white/10" />

                    <motion.div
                      onClick={() => {
                        useUser.setState({ user: undefined });
                        localStorage.removeItem("token");
                        toast.success("Logout successful");
                        navigate("/login");
                      }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 28,
                        delay: 0.03,
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full items-center justify-between rounded-lg px-[12px] py-[10px] text-left text-sm text-white hover:cursor-pointer hover:bg-white/5"
                    >
                      <span>Logout</span> <LogOut className="size-4" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </>
  );
};

export default TopBar;

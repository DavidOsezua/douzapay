import { Button } from "@/components/ui/button";
import { useFormatAmountWithCurrency } from "@/hooks/use-format-with-currency";
import { getCurrencyIconPath } from "@/lib/utils";
import { useModalStore } from "@/zustand/modalStore";
import { useSheetStore } from "@/zustand/sheetStore";
import { useGetUserAssets } from "@/hooks/use-queries";
import { useUser } from "@/zustand/store";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MyAccount = () => {
  const { user } = useUser();
  const formatAmount = useFormatAmountWithCurrency();
  const { data: userAssets } = useGetUserAssets();
  const totalBalance = (userAssets ?? []).reduce(
    (sum: number, a: any) => sum + Number(a.balance),
    0,
  );
  const { openSheet } = useSheetStore();
  const { openModal } = useModalStore();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const navigate = useNavigate();

  return (
    <div className="text-white">
      <div className="bg-dark-account text-[#0F1326] mt-4 mx-4 rounded-3xl p-4">
        <div className="flex items-center gap-4">
          <div className="flex size-9 items-center justify-center gap-2 rounded-full bg-[#B4EAFF] font-medium text-[#242424]">
            <span>{user?.firstName?.substring(0, 1)}</span>{" "}
          </div>
          <p className="text-lg font-medium">{`Hello, ${user?.firstName} ${user?.lastName}`}</p>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium">Wallet balance</p>
          <p className="text-2xl font-bold">{formatAmount(totalBalance)}</p>
        </div>
      </div>

      <div className="mt-4 px-4">
        <div className="bg-dark-card-3 rounded-lg px-6 py-3">
          <h3 className="font-bold">Personal Information</h3>
          <div className="mt-4">
            <button
              onClick={() => openSheet("editProfile", 2, {}, false)}
              className="flex w-full cursor-pointer items-center justify-between py-4 text-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  className="size-7"
                  src="/icons/account-active.svg"
                  alt="Profile Details"
                />
                <span>Profile Details</span>
              </div>
              <ChevronRight size={20} />
            </button>
            <div className="border-t border-white/10" />
            <button
              onClick={() => openSheet("referral")}
              className="flex w-full cursor-pointer items-center justify-between py-4 text-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  className="size-7"
                  src="/icons/users-active.svg"
                  alt="Referral"
                />
                <span>Referral</span>
              </div>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="bg-dark-card-3 mt-4 rounded-lg px-6 py-3">
          <h3 className="font-bold">Settings</h3>
          <div className="mt-4">
            <button
              onClick={() => navigate("/dashboard/account/security")}
              className="flex w-full items-center justify-between py-4 text-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  className="size-7"
                  src="/icons/2fa-shaded.svg"
                  alt="Security"
                />
                <span>Security</span>
              </div>
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => openModal("currencySetting")}
              className="flex w-full items-center justify-between py-4 text-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  className="size-7"
                  src={getCurrencyIconPath(user?.preferredCurrency || "")}
                  alt="Currency"
                />
                <span>Change Currency</span>
              </div>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="bg-dark-card-3 mt-4 rounded-lg px-6 py-3">
          <h3 className="font-bold">Support</h3>
          <div className="mt-4">
            <button
              onClick={() => openSheet("contactUs")}
              className="hidden w-full items-center justify-between py-4 text-sm lg:flex"
            >
              <div className="flex items-center gap-4">
                <img className="size-7" src="/icons/contact-us.svg" alt="2fa" />
                <span>Contact Us</span>
              </div>
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => openModal("contactUs")}
              className="flex w-full items-center justify-between py-4 text-sm lg:hidden"
            >
              <div className="flex items-center gap-4">
                <img className="size-7" src="/icons/contact-us.svg" alt="2fa" />
                <span>Contact Us</span>
              </div>
              <ChevronRight size={20} />
            </button>
            <div className="border-t border-white/10" />
            <button
              onClick={() => {
                openSheet("termsCondition");
              }}
              className="flex w-full items-center justify-between py-4 text-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  className="size-7"
                  src="/icons/terms.svg"
                  alt="Profile Details"
                />
                <span>Terms and Conditions</span>
              </div>
              <ChevronRight size={20} />
            </button>
            <Button
              onClick={() => {
                useUser.setState({ user: undefined });
                localStorage.removeItem("token");
                toast.success("Logout successful");
                navigate("/login");
              }}
              className="text-white hover:bg-dark-primary-main/80 flex h-auto w-full items-center justify-between bg-transparent !px-0 py-4 text-sm hover:text-[#242424]"
            >
              <div className="flex items-center gap-4">
                <img className="size-6" src="/icons/logout.svg" alt="Logout" />
                <span>Logout</span>
              </div>
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;

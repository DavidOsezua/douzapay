import { useUser } from "@/zustand/store";
import { ChevronRight } from "lucide-react";

const ContactUs = () => {
  const { user } = useUser();
  const openTelegram = () => {
    window.open("https://t.me/krypkardsupport", "_blank", "noopener,noreferrer");
  };
  const openEmail = () => {
    window.open(
      "mailto:support@krypkard.com",
      "_blank",
      "noopener,noreferrer",
    );
  };
  return (
    <div>
      <h3 className="text-[#E1E1E1] text-2xl">
        Hello {user?.firstName}, 👋🏻
      </h3>
      <h3 className="text-white text-2xl">How can we help you?</h3>

      <div className="mt-4">
        <div className="rounded-lg px-3 py-3">
          <div
            onClick={openEmail}
            className="flex w-full items-center justify-between py-4 text-sm hover:cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#6EF7FF2E]">
                <img className="size-5" src="/icons/send-email.svg" alt="" />
              </div>
              <span className="text-white">Send an Email</span>
            </div>
            <ChevronRight size={20} className="text-dark-primary-main" />
          </div>
          <div className="border-t border-[#6EF7FF2E]" />
          <div
            onClick={openTelegram}
            className="flex w-full items-center justify-between py-4 text-sm hover:cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#6EF7FF2E]">
                <img
                  className="size-5"
                  src="/icons/send-telegram.svg"
                  alt=""
                />
              </div>
              <span className="text-white">
                Send an Telegram Message
              </span>
            </div>
            <ChevronRight size={20} className="text-dark-primary-main" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

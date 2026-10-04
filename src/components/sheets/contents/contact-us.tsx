import { useUser } from "@/zustand/store";
import { ChevronRight } from "lucide-react";

const ContactUs = () => {
  const { user } = useUser();
  const openTelegram = () => {
    window.open("https://t.me/duozapaysupport", "_blank", "noopener,noreferrer");
  };
  const openEmail = () => {
    window.open(
      "mailto:support@duozapay.com",
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
        <div className="bg-dark-card-gradient-3 border-dark-stroke-5 rounded-lg border px-3 py-3">
          <div
            // onClick={openEmail}
            className="flex w-full items-center justify-between py-4 text-sm hover:cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <img
                className="size-6 shrink-0"
                src="/icons/contact-email.svg"
                alt=""
              />
              <span className="text-white">Send an Email</span>
            </div>
            <ChevronRight size={20} className="text-dark-primary-main" />
          </div>
          <div className="border-dark-stroke-5 border-t" />
          <div
            // onClick={openTelegram}
            className="flex w-full items-center justify-between py-4 text-sm hover:cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <img
                className="size-6 shrink-0"
                src="/icons/contact-telegram.svg"
                alt=""
              />
              <span className="text-white">
                Send a Telegram Message
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

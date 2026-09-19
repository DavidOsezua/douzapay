import type { ComponentType, FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ModalBackdrop } from "./modal-backdrop";
import { useModalStore } from "@/zustand/modalStore";
import { useIsMobile } from "@/hooks/use-mobile";
import SelectDeposit from "./contents/select-deposit-method";
import SuccessNotice from "./contents/success-notice";
import Transfer from "./contents/transfer";
import FundCard from "./contents/fund-card";
import FundWallet from "./contents/fund-wallet";
import DeleteCard from "./contents/delete-card";
import ConfirmPassword from "./contents/confirm-password";
import MoreCardOptions from "./contents/more-card-options";
import FreezeCard from "./contents/freeze-card";
import ContactUs from "../sheets/contents/contact-us";
import SelectAutoDeposit from "./contents/select-auto-deposit-method";
import CurrencySetting from "./contents/currency-setting";
import SelectAssetForCard from "./contents/select-asset-for-card";
import InternalTransferAssetSelect from "./contents/internal-transfer-asset-select";
import ConfirmInternalTransfer from "./contents/confirm-internal-transfer";
import OtpInternalTransfer from "./contents/otp-internal-transfer";

export type ModalPayload = {
  walletDeposit: {
    walletId: string;
  };
  walletAutoDeposit: {};
  success: {
    type:
      | "withdrawal"
      | "deposit"
      | "card-topup"
      | "register"
      | "card-withdrawal"
      | "internal-transfer"
      | "register";
    transaction?: {
      id: number | string;
      amount: string | number;
      createdAt: string;
    };
  };
  transfer: {};
  fundCard: {
    cardData: Card;
  };
  fundWallet: {
    cardData: Card;
  };
  confirmPassword: {
    cardData: Card;
  };
  freezeCard: {
    cardData: Card;
  };
  deleteCard: {
    cardData: Card;
  };
  moreCardOptions: {
    cardData: Card;
  };
  contactUs: {};
  currencySetting: {};
  selectAssetForCard: {
    cardPayload: Omit<BuyCardPayload, "assetId">;
    total: number;
    onSuccess: () => void;
  };
  internalTransferAssetSelect: {};
  confirmInternalTransfer: {
    toUserId: string;
    payeeName: string;
    payeeEmail: string;
    assetId: number;
    amount: number;
    tokenSymbol: string;
  };
  otpInternalTransfer: {
    toUserId: string;
    payeeName: string;
    payeeEmail: string;
    assetId: number;
    amount: number;
    tokenSymbol: string;
  };
};

type ModalType = keyof ModalPayload;

interface ModalContentConfig {
  component: ComponentType<{ closeModal: () => void } & Record<string, any>>;
  props: Record<string, any>;
}

// Map modal types to components
const modalContentMap: Partial<Record<ModalType, ModalContentConfig>> = {
  walletDeposit: {
    component: SelectDeposit,
    props: { walletId: "" },
  },
  walletAutoDeposit: {
    component: SelectAutoDeposit,
    props: {},
  },
  transfer: {
    component: Transfer as any,
    props: {},
  },
  success: {
    component: SuccessNotice as any,
    props: {},
  },
  fundCard: {
    component: FundCard as any,
    props: { cardData: {} },
  },
  fundWallet: {
    component: FundWallet as any,
    props: { cardData: {} },
  },
  confirmPassword: {
    component: ConfirmPassword as any,
    props: {},
  },
  deleteCard: {
    component: DeleteCard as any,
    props: { cardData: {} },
  },
  freezeCard: {
    component: FreezeCard as any,
    props: { cardData: {} },
  },
  moreCardOptions: {
    component: MoreCardOptions as any,
    props: {},
  },
  contactUs: {
    component: ContactUs as any,
    props: {},
  },
  currencySetting: {
    component: CurrencySetting as any,
    props: {},
  },
  selectAssetForCard: {
    component: SelectAssetForCard as any,
    props: {},
  },
  internalTransferAssetSelect: {
    component: InternalTransferAssetSelect as any,
    props: {},
  },
  confirmInternalTransfer: {
    component: ConfirmInternalTransfer as any,
    props: {},
  },
  otpInternalTransfer: {
    component: OtpInternalTransfer as any,
    props: {},
  },
};

const Modal: FC = () => {
  const { isOpen, modalType, modalProps, closeModal } = useModalStore();
  const isMobile = useIsMobile();

  if (!isOpen || !modalType) return null;

  const { component: ContentComponent, props: defaultProps } = modalContentMap[
    modalType
  ] || {
    component: () => <div>Unknown modal type</div>,
    props: {},
  };

  const definedModalProps = Object.fromEntries(
    Object.entries(modalProps ?? {}).filter(([, value]) => value !== undefined),
  );

  const contentProps = {
    ...defaultProps,
    ...definedModalProps,
    closeModal,
  };

  const modalVariants = {
    mobile: {
      initial: { y: "100vh", opacity: 0 },
      animate: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.3, ease: "easeOut" },
      },
      exit: {
        y: "100vh",
        opacity: 0,
        transition: { duration: 0.3, ease: "easeIn" },
      },
    },
    desktop: {
      initial: { scale: 0.5, opacity: 0 },
      animate: {
        scale: 1,
        opacity: 1,
        transition: { duration: 0.3, ease: "easeOut" },
      },
      exit: {
        scale: 0.5,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeIn" },
      },
    },
  };
  const isFundModal =
    modalType === "fundCard" ||
    modalType === "fundWallet" ||
    modalType === "selectAssetForCard" ||
    modalType === "internalTransferAssetSelect" ||
    modalType === "confirmInternalTransfer" ||
    modalType === "otpInternalTransfer" ||
    modalType === "success";
  const zIndexClass = isFundModal ? "z-[999]" : "";

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <ModalBackdrop
          className={isFundModal ? "z-[999]" : " "}
          style={isFundModal ? { pointerEvents: "auto" } : undefined}
          onClose={closeModal}
        >
          <motion.div
            onClick={(e) => {
              e.stopPropagation();
            }}
            variants={isMobile ? modalVariants.mobile : modalVariants.desktop}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`font-urbanist fixed bottom-0 h-auto w-full max-w-full rounded-t-2xl border-t border-t-white/25 px-4 py-4 text-white backdrop-blur-md md:max-w-[400px] md:rounded-2xl lg:static lg:bottom-auto lg:max-w-110 lg:rounded-2xl lg:pb-6 ${zIndexClass}"`}
            style={{
              pointerEvents: isFundModal ? "auto" : undefined,
              background:
                "linear-gradient(129.49deg, rgba(58, 58, 58, 0.2) 3.6%, rgba(94, 91, 91, 0.2) 100%)",
            }}
          >
            <div className="absolute top-2 right-1/2 block h-1 w-20 translate-x-1/2 rounded-full bg-[#C4C6C8] lg:hidden" />
            <div className="relative mx-auto text-lg">
              <button
                onClick={closeModal}
                className="-top-24 right-1/2 mb-6 flex items-center justify-center text-white transition-all hover:cursor-pointer hover:shadow-[inset_2px_2px_6px_rgba(255,255,255,0.2),inset_-2px_-2px_6px_rgba(0,0,0,0.5)] active:scale-90 lg:absolute lg:mb-0 lg:size-10 lg:translate-x-1/2 lg:rounded-full lg:border lg:border-white/20 lg:bg-white/5 lg:shadow-[inset_2px_2px_6px_rgba(255,255,255,0.2),inset_-2px_-2px_6px_rgba(0,0,0,0.5)] lg:backdrop-blur-md"
              >
                <img
                  src="/images/glass-rounded.png"
                  alt=""
                  className="absolute inset-0 hidden lg:inline"
                />
                <X className="size-6" />
              </button>

              <ContentComponent {...contentProps} />
            </div>
          </motion.div>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};

export default Modal;

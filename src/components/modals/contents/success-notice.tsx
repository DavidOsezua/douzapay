import DepositIcon from "@/components/icons/deposit-icon";
import WithdrawIcon from "@/components/icons/withdraw-icon";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import TopupCountdown from "@/components/topup-countdown";

const SuccessNotice = ({
  type,
  transaction,
  closeModal,
}: {
  type:
    | "withdrawal"
    | "deposit"
    | "card-topup"
    | "card-withdrawal"
    | "internal-transfer"
    | "add-contact"
    | "register";
  transaction?: { id: number | string; amount: string | number; createdAt: string };
  closeModal: () => void;
}) => {
  if (type === "deposit")
    return (
      <div className="my-4 flex w-full flex-col items-center gap-4">
        <div
          className="border-primary-100 flex size-16 items-center justify-center rounded-full border"
          style={{
            background:
              "linear-gradient(100.47deg, #5778C766 9.36%, #545A9366 100%)",
          }}
        >
          <DepositIcon  />
        </div>
        <div className="mt-2 text-2xl font-medium">Deposit successful</div>
        <div className="mt-4 flex w-full items-center gap-2">
          <Button
            onClick={closeModal}
            className="text-[#080808] bg-dark-primary-main hover:bg-dark-primary-100 h-11 grow"
          >
            Continue
          </Button>
          <Button
            onClick={closeModal}
            className="border-dark-primary-main hover:bg-dark-primary-100 text-white h-11 grow border bg-transparent"
          >
            See Details
          </Button>
        </div>
      </div>
    );

  if (type === "withdrawal")
    return (
      <div className="my-4 flex w-full flex-col items-center gap-4">
        <div className="border-primary-100 flex size-16 items-center justify-center rounded-full border">
          <WithdrawIcon className="text-primary-100" />
        </div>
        <div className="mt-2 text-2xl font-medium">Withdrawal successful</div>
        <div className="mt-4 flex w-full items-center gap-2">
          <Button
            onClick={closeModal}
            className="text-[#080808] bg-dark-primary-main hover:bg-dark-primary-100 h-11 grow"
          >
            Continue
          </Button>
          <Button
            onClick={closeModal}
            className="border-dark-primary-main hover:bg-dark-primary-100 text-white h-11 grow border bg-transparent"
          >
            See Details
          </Button>
        </div>
      </div>
    );

  if (type === "internal-transfer")
    return (
      <div className="my-4 flex w-full flex-col items-center gap-4">
        <div className="border-primary-100 flex size-16 items-center justify-center rounded-full border">
          <Check className="text-primary-100" />
        </div>
        <div className="mt-2 text-2xl font-medium">Transfer successful</div>
        <div className="mt-4 flex w-full items-center gap-2">
          <Button
            onClick={closeModal}
            className="text-[#080808] bg-dark-primary-main hover:bg-dark-primary-100 h-11 grow"
          >
            Done
          </Button>
        </div>
      </div>
    );

  if (type === "card-topup")
    return (
      <div className="my-4 w-full">
        <div className="flex flex-col items-center gap-2">
          <div>
            <DepositIcon />
          </div>
          <div className="text-2xl font-medium">Card Top-Up Processing</div>
          <p className="text-primary-50 text-center text-sm">
            Your top-up has been submitted and is being processed.
          </p>
        </div>
        {transaction ? (
          <TopupCountdown
            createdAt={transaction.createdAt}
            transactionId={transaction.id}
            amount={transaction.amount}
          />
        ) : (
          <TopupCountdown
            createdAt={new Date().toISOString()}
            transactionId="-"
            amount="-"
          />
        )}
        <div className="mt-4">
          <Button
            onClick={closeModal}
            className="text-[#080808] bg-dark-primary-main hover:bg-dark-primary-100 h-11 w-full"
          >
            Done
          </Button>
        </div>
      </div>
    );

  if (type === "card-withdrawal")
    return (
      <div className="my-4 flex w-full flex-col items-center gap-4">
        <div className="border-primary-100 flex size-16 items-center justify-center rounded-full border">
          <WithdrawIcon className="text-primary-100" />
        </div>
        <div className="mt-2 text-2xl font-medium">
          Card Withdrawal successful
        </div>
        <div className="mt-4 flex w-full items-center gap-2">
          <Button
            onClick={closeModal}
            className="text-[#080808] bg-dark-primary-main hover:bg-dark-primary-100 h-11 grow"
          >
            Continue
          </Button>
          <Button
            onClick={closeModal}
            className="border-dark-primary-main hover:bg-dark-primary-100 text-white h-11 grow border bg-transparent"
          >
            See Details
          </Button>
        </div>
      </div>
    );

  if (type === "add-contact")
    return (
      <div className="my-4 flex w-full flex-col items-center gap-4">
        <div
          className="border-primary-100 flex size-16 items-center justify-center rounded-full border"
          style={{
            background:
              "linear-gradient(100.47deg, #5778C766 9.36%, #545A9366 100%)",
          }}
        >
          <Check className="text-primary-100" />
        </div>
        <div className="mt-2 text-2xl font-medium">
          Contact added successfully
        </div>
        <div className="mt-4 flex w-full items-center gap-2">
          <Button
            onClick={closeModal}
            className="text-primary-500 bg-dark-primary-main hover:bg-dark-primary-100 h-11 grow"
          >
            Close
          </Button>
        </div>
      </div>
    );

  if (type === "register")
    return (
      <div className="my-4 flex w-full flex-col items-center gap-4">
        <div className="border-dark-primary-main bg-dark-primary-50 flex size-16 items-center justify-center rounded-full border">
          <Check className="text-dark-primary-main" />
        </div>
        <div className="mt-2 text-2xl font-medium">
          Account created successfully
        </div>
        <div className="mt-4 flex w-full items-center gap-2">
          <Button
            onClick={() => (window.location.href = "/login")}
            className="text-dark-text-400 bg-dark-primary-main hover:bg-dark-primary-100 h-11 grow"
          >
            Continue to Login
          </Button>
        </div>
      </div>
    );
};

export default SuccessNotice;

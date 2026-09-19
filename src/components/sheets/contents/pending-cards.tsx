import { Button } from "@/components/ui/button";
import {
  useGetBIN,
  useGetPendingCards,
  useGetPendingHolders,
} from "@/hooks/use-queries";
import { useSheetStore } from "@/zustand/sheetStore";
import moment from "moment";
import { resolveCardStyle } from "@/pages/dashboard/shop/page";

// Shape we rely on from GET /cards/bins (see shop/page.tsx for the full object).
type BackendBin = {
  id: number | string;
  bin: string;
  network: string;
  provider?: string;
};

const digitsOnly = (v: string | number | null | undefined) =>
  String(v ?? "").replace(/\D/g, "");

type PendingHolder = {
  id: number;
  userId: string;
  cardId: string | null;
  cardHolderId: string | null;
  // Details of the cardholder being created (not the account owner — that's `user`).
  firstName: string;
  lastName: string;
  email: string;
  geoCountry: string | null;
  ipAddress: string | null;
  bin: string;
  fee: string;
  amount: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    balance: number;
  };
};

const PendingCards = ({ closeSheet }: { closeSheet: () => void }) => {
  const { data: cards, isLoading: cardIsLoading } = useGetPendingCards();
  const { data: holders, isLoading: holdersLoading } = useGetPendingHolders();
  const { data: bins } = useGetBIN();

  const isLoading = cardIsLoading || holdersLoading;
  const hasCards = cards?.data?.length > 0;
  const hasHolders = holders?.data?.length > 0;
  const hasAny = hasCards || hasHolders;

  return (
    <div className="text-white mt-4 px-2">
      <h2 className="font-semibold">Card creation in progress</h2>

      <div className="mt-4">
        <h4 className="text-sm">Select card to see your details</h4>
        {isLoading ? (
          <div className="relative mt-6 flex flex-col gap-4">
            {[1, 2, 3].map((index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : hasAny ? (
          <div>
            <div className="mt-6 flex flex-col gap-4">
              {holders?.data?.map((holder: PendingHolder) => (
                <PlatinumHolderCard
                  holder={holder}
                  bins={(bins ?? []) as BackendBin[]}
                  key={holder.id}
                />
              ))}
              {cards?.data?.map((card: PendingCard) => (
                <RegularCard cardData={card} key={card.id} />
              ))}
            </div>
            <div className="mt-6">
              <Button
                onClick={closeSheet}
                className="text-[#242424] bg-dark-primary-main/80 hover:bg-dark-primary-main/60 h-10 w-full"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex h-100 items-center justify-center">
            <div className="flex flex-col text-center">
              <h2 className="text-2xl font-bold">No Pending Cards</h2>
              <p className="text-white/40">
                You don&apos;t have any pending cards
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingCards;

const CardSkeleton = () => (
  <div className="h-18 w-full max-w-lg animate-pulse overflow-hidden rounded-xl bg-gray-700 shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px]" />
);

const PlatinumHolderCard = ({
  holder,
  bins,
}: {
  holder: PendingHolder;
  bins: BackendBin[];
}) => {
  const holderBin = digitsOnly(holder.bin);

  // `holder.bin` is the value submitted at creation (a BIN id / prefix). Match
  // it back to the live BIN list so the network + PAN prefix come from the
  // backend, not a hardcoded table.
  const matchedBin = bins.find(
    (b) =>
      String(b.id) === String(holder.bin) ||
      digitsOnly(b.bin) === holderBin ||
      (holderBin.length >= 4 && digitsOnly(b.bin).startsWith(holderBin)),
  );

  // Prefer the backend's network; fall back to the ISO/IEC 7812 major-industry
  // rule (Visa = 4, Mastercard = 51-55 / 2221-2720) only when unmatched.
  const rawNetwork = matchedBin?.network ?? "";
  const network = /visa/i.test(rawNetwork)
    ? "Visa"
    : /master/i.test(rawNetwork)
      ? "MasterCard"
      : holderBin.startsWith("4")
        ? "Visa"
        : "MasterCard";

  const pan = digitsOnly(matchedBin?.bin) || holderBin;
  const binDisplay = `${pan.slice(0, 4).padEnd(4, "*")} **** **** ****`;

  const style = resolveCardStyle(pan, network);

  const holderName =
    `${holder.firstName ?? ""} ${holder.lastName ?? ""}`.trim() ||
    `${holder.user?.firstName ?? ""} ${holder.user?.lastName ?? ""}`.trim() ||
    "Cardholder";

  return (
    <div
      className="relative overflow-hidden rounded-xl p-4"
      style={{ background: style.background }}
    >
      {style.blBlurImage && (
        <img
          className="absolute bottom-0 left-0 z-10"
          src={style.blBlurImage}
          alt=""
        />
      )}
      {style.tlBlurImage && (
        <img
          className="absolute top-0 left-0 z-10"
          src={style.tlBlurImage}
          alt=""
        />
      )}
      {style.trBlurImage && (
        <img
          className="absolute top-0 right-0 z-10"
          src={style.trBlurImage}
          alt=""
        />
      )}
      <img
        className="absolute top-0 right-0 z-[11]"
        src={style.linesImage ?? "/images/card-lines.svg"}
        alt=""
      />

      <div className="relative z-20 flex justify-between">
        <div>
          <img
            src={style.logoImage}
            className="h-3.5 w-auto object-contain"
            alt="logo"
          />
          <p className="mt-3 text-sm font-medium tracking-widest text-white">
            {binDisplay}
          </p>
          <p className="mt-1 text-sm font-semibold capitalize text-white">
            {holderName}
          </p>
        </div>
        <div className="flex items-end">
          {network === "MasterCard" ? (
            <img
              src="/images/mastercard-logo.svg"
              alt="Mastercard"
              className="h-6 object-contain"
            />
          ) : (
            <img
              src="/images/visa-white.png"
              alt="Visa"
              className="h-4 object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const RegularCard = ({ cardData }: { cardData: PendingCard }) => {
  const { openSheet } = useSheetStore();
  return (
    <div
      role="button"
      onClick={() => openSheet("pendingCardDetails", null, { cardData })}
      tabIndex={0}
      className="relative overflow-hidden rounded-xl border border-[#4D698B] p-4 transition-all hover:cursor-pointer active:scale-x-98"
      style={{
        background:
          "linear-gradient(11.41deg, #161A2E80 5.95%, #15161C80 102.98%)",
      }}
    >
      <div className="absolute inset-0 z-0 bg-[#6060600D] backdrop-blur-sm" />
      <img
        className="absolute right-0 bottom-0 w-30"
        src="/images/card-lines.svg"
        alt=""
      />
      <img
        className="absolute bottom-0 left-0 h-full"
        src="/images/card-blur2.svg"
        alt=""
      />

      <div className="relative flex h-full w-full items-center justify-between">
        <div>
          <p>
            {cardData.firstName} {cardData.lastName}
          </p>
          <p className="text-xs">{cardData.email}</p>
        </div>
        <div>
          <p className="text-xs">Created Date:</p>
          <p>
            {cardData.createdAt
              ? moment(cardData.createdAt).isSame(moment(), "day")
                ? "Today"
                : moment(cardData.createdAt).isSame(
                      moment().subtract(1, "day"),
                      "day",
                    )
                  ? "Yesterday"
                  : moment(cardData.createdAt).fromNow()
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

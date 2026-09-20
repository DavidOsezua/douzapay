import { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import TopBar from "@/components/topbar";
import { useSheetStore } from "@/zustand/sheetStore";
import BinCard from "@/components/bin-card";
import { useGetBIN } from "@/hooks/use-queries";

// ── Types ────────────────────────────────────────────────────────────────────

export type BinCardData = {
  id: number;
  name: string;
  image: string;
  price: number;
  defaultPrice?: number;
  bin: string;
  binValue: string;
  logoImage?: string;
  payBadgeBackground?: string;
  network: string;
  cardType: string;
  provider: string;
  needDepositForActiveCard: boolean;
  needCardHolder: boolean;
  minDepositAmount: number;
  maxDepositAmount: number;
  topUpFee: number;
  background?: string;
  cardBorder?: string;
};

// ── Style presets ────────────────────────────────────────────────────────────

const sapphireStyle = {
  logoImage: "/images/sapphire-logo.svg",
  payBadgeBackground:
    "linear-gradient(90deg, rgba(180, 234, 255, 0.16) 0%, rgba(22, 27, 51, 0.16) 100%)",
  background: "url('/images/sapphire-card-bg.png') center / cover no-repeat",
};

const platinumVisaStyle = {
  logoImage: "/images/platinum-visa-logo.svg",
  payBadgeBackground:
    "linear-gradient(90deg, rgba(240, 229, 255, 0.16) 0%, rgba(102, 22, 167, 0.16) 100%)",
  background:
    "url('/images/platinum-visa-card-bg.png') center / cover no-repeat",
};

const platinumMastercardStyle = {
  logoImage: "/images/platinum-mastercard-logo.svg",
  payBadgeBackground:
    " linear-gradient(155.06deg, rgba(136, 97, 48, 0.3) -8.11%, rgba(93, 52, 1, 0.3) 37.06%, rgba(23, 14, 0, 0.3) 93.93%)",
  background:
    "url('/images/platinum-mastercard-card-bg.png') center / cover no-repeat",
};

// Exported for use by other sheets (create-platinum-card, pending-cards, etc.)
export const binCards = {
  sapphire: {
    id: 537100,
    name: "Sapphire Card",
    image: "",
    price: 26,
    bin: "5371 0000 0000 0000",
    binValue: "537100",
    network: "MasterCard",
    cardType: "PrepaidCard",
    provider: "int",
    needDepositForActiveCard: true,
    needCardHolder: false,
    minDepositAmount: 0,
    maxDepositAmount: 1000000,
    topUpFee: 0,
    ...sapphireStyle,
  },
  platinum: {
    id: 111068,
    name: "Platinum Visa",
    image: "",
    price: 40,
    bin: "4938 7519 0000 0000",
    binValue: "49387519",
    network: "Visa",
    cardType: "PrepaidCard",
    provider: "wsb",
    needDepositForActiveCard: true,
    needCardHolder: true,
    minDepositAmount: 1,
    maxDepositAmount: 1000000,
    topUpFee: 1,
    ...platinumVisaStyle,
  },
  platinumBasic: {
    id: 111078,
    name: "Platinum MC",
    image: "",
    price: 35,
    bin: "5240 1300 0000 0000",
    binValue: "524013",
    network: "MasterCard",
    cardType: "PrepaidCard",
    provider: "wsb",
    needDepositForActiveCard: true,
    needCardHolder: false,
    minDepositAmount: 0,
    maxDepositAmount: 1000000,
    topUpFee: 1,
    ...platinumMastercardStyle,
  },
} satisfies Record<string, BinCardData>;

// ── Helpers ──────────────────────────────────────────────────────────────────

type CardStyle = {
  background: string;
  cardBorder?: string;
  logoImage?: string;
  payBadgeBackground?: string;
};

// Single source of truth for card styling: it's a function of (provider, network)
// only. `provider === "int"` is the sapphire family; everything else is a platinum
// card distinguished by network.
function cardStyle(provider: string, network?: string): CardStyle {
  if (provider === "int") return sapphireStyle;
  if (network === "VISA" || network === "Visa") return platinumVisaStyle;
  return platinumMastercardStyle;
}

// A real `Card` carries no `provider`, so recover it by matching the card's BIN
// prefix against the known catalog. Supporting a new BIN (or a changed one) is
// then just a `binCards` entry — no magic literals here.
function providerForBin(bin: string | undefined): string {
  const digits = (bin ?? "").replace(/\D/g, "");
  if (digits.length < 6) return "";
  const entry = Object.values(binCards).find(
    (c) => digits.startsWith(c.binValue) || c.binValue.startsWith(digits),
  );
  return entry?.provider ?? "";
}

// Resolves style for a real card from its BIN prefix + network.
export function resolveCardStyle(bin: string, network?: string): CardStyle {
  return cardStyle(providerForBin(bin), network);
}

function supportText(provider: string) {
  const hi = (text: string) => (
    <strong style={{ color: "#3A9DBF" }}>{text}</strong>
  );
  if (provider === "int")
    return {
      supportTitle: "Supported Usage Scenarios",
      supportBody: (
        <>
          The card {hi("DOES NOT")} currently support Uber, Petrol stations,
          Talabat, Hermes Amsterdam, Hermes Paris, and Iberia and a few other
          merchants.
        </>
      ),
    };
  return {
    supportTitle: "Supported Usage Scenarios",
    supportBody: (
      <>
        The card {hi("SUPPORTS")} Uber, petrol stations, YouTube, AliExpress,
        Amazon, Iberia, Talabat.
      </>
    ),
  };
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

const CardSkeleton = () => (
  <div className="bg-dark-card-3 rounded-2xl border border-[#3A3A3A] p-3 shadow-sm sm:p-4">
    <div className="h-[180px] animate-pulse rounded-xl bg-gray-200" />
    <div className="mt-3 space-y-2">
      <div className="h-2.5 w-28 animate-pulse rounded-full bg-gray-200" />
      <div className="h-2.5 w-full animate-pulse rounded-full bg-gray-200" />
      <div className="h-2.5 w-3/4 animate-pulse rounded-full bg-gray-200" />
    </div>
    <div className="mt-3 flex items-center justify-between border-t border-[#3A3A3A] pt-3">
      <div className="h-5 w-24 animate-pulse rounded-full bg-gray-200" />
      <div className="size-4 animate-pulse rounded-full bg-gray-200" />
    </div>
  </div>
);

// ── Shop ─────────────────────────────────────────────────────────────────────

const Shop = () => {
  const { openSheet } = useSheetStore();
  const { data: bins, isLoading } = useGetBIN();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleClick = (bin: any) => {
    if (bin.provider === "int") {
      openSheet("createSapphireCard", 2, { price: Number(bin.price) }, false);
    } else {
      openSheet(
        "createPlatinumCard",
        2,
        {
          bin: {
            id: Number(bin.id),
            bin: bin.bin,
            network: bin.network,
            price: Number(bin.price),
            defaultPrice: Number(bin.defaultPrice),
            topUpFee: Number(bin.topUpFee),
          },
        },
        false,
      );
    }
  };

  return (
    <div>
      <TopBar title="Back" backTo="/dashboard/cards" />

      <div className="px-4 pt-4 pb-8 lg:px-6 lg:pt-6">
        {/* Banner */}
        <div className="bg-dark-card-3 relative overflow-hidden rounded-2xl px-4 py-4 shadow-sm sm:px-5 sm:py-5">
          <p className="text-white text-sm leading-5 sm:text-base sm:leading-6">
            Buy cards for seamless online and offline use on My Pay.
          </p>
          <div className="absolute top-0 right-0 h-full w-20 overflow-hidden rounded-r-2xl opacity-10 sm:w-24 lg:w-32">
            <img
              src="/images/logo-transparent-light.svg"
              alt=""
              className="absolute top-1/2 right-2 h-12 w-12 -translate-y-1/2 sm:right-3 sm:h-16 sm:w-16"
            />
          </div>
        </div>

        {/* Card grid */}
        <div className="mx-auto mt-4 grid max-w-[430px] gap-3 sm:mt-5 sm:gap-4 md:max-w-none lg:grid-cols-3">
          {isLoading ? (
            [1, 2, 3].map((i) => <CardSkeleton key={i} />)
          ) : (
            <>
              {((bins ?? []) as any[])
                .filter((b) => b.isActive)
                .map((bin, i) => {
                  const style = cardStyle(bin.provider, bin.network);
                  const { supportTitle, supportBody } = supportText(
                    bin.provider,
                  );
                  const card: BinCardData = {
                    ...style,
                    id: bin.id,
                    name: "Virtual Card",
                    image: "",
                    price: Number(bin.price),
                    defaultPrice:
                      bin.provider !== "int"
                        ? Number(bin.defaultPrice)
                        : undefined,
                    bin: bin.bin,
                    binValue: bin.bin,
                    network: bin.network,
                    cardType: bin.cardType,
                    provider: bin.provider,
                    needDepositForActiveCard: bin.needDepositForActiveCard,
                    needCardHolder: bin.needCardHolder,
                    minDepositAmount: Number(bin.minDepositAmount),
                    maxDepositAmount: Number(bin.maxDepositAmount),
                    topUpFee: Number(bin.topUpFee),
                  };

                  return (
                    <button
                      key={i}
                      onClick={() => handleClick(bin)}
                      className="block h-full w-full cursor-pointer text-left"
                    >
                      <div
                        className="group relative h-full rounded-2xl border border-[#3A3A3A] p-3 shadow-sm sm:p-4"
                        style={{
                          background:
                            "linear-gradient(129.49deg, rgba(27, 31, 53, 0.2) 3.6%, rgba(22, 25, 44, 0.2) 100%)",
                        }}
                      >
                        <BinCard
                          card={card}
                          className="!h-[180px] rounded-2xl"
                        />
                        <div className="mt-3 space-y-1.5">
                          <p className="text-[11px] text-[#9CA3AF]">
                            {supportTitle}
                          </p>
                          <p className="text-dark-text-300 min-h-10 text-[11px] leading-4 sm:min-h-12 sm:text-xs">
                            {supportBody}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between pt-3 sm:mt-4">
                          <span className="text-white text-base font-semibold sm:text-lg">
                            Virtual Card
                          </span>
                          <ChevronRight className="text-[#F7F9FD] size-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </button>
                  );
                })}

              {/* Physical card — coming soon */}
              <div className="h-full">
                <div
                  className="group relative h-full rounded-2xl border border-[#3A3A3A] p-3 shadow-sm sm:p-4"
                  style={{
                    background:
                      "linear-gradient(129.49deg, rgba(27, 31, 53, 0.2) 3.6%, rgba(22, 25, 44, 0.2) 100%)",
                  }}
                >
                  <div className="h-[180px] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800" />
                  <div className="mt-3 space-y-1.5">
                    <p className="text-[11px] text-[#9CA3AF]">
                      Supported Usage Scenarios
                    </p>
                    <p className="text-dark-text-300 min-h-10 text-[11px] leading-4 sm:min-h-12 sm:text-xs">
                      Everyday use for both online and offline purchase and ATM
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-3 sm:mt-4">
                    <span className="text-white text-base font-semibold sm:text-lg">
                      Physical Card
                    </span>
                    <span className="rounded-full border border-[#E8EDF3] bg-[#F5F7FA] px-3 py-1 text-[10px] tracking-[0.18em] text-[#9CA3AF] uppercase">
                      Coming soon
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;

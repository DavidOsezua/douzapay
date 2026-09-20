import { useState } from "react";
import { binCards } from "@/pages/dashboard/shop/page";
import { useGetBIN } from "@/hooks/use-queries";

const tabs = ["Infinite Card", "Platinum Card"] as const;

const formatRange = (min: number, max: number, suffix = "") =>
  min === max ? `${min}${suffix}` : `${min}${suffix} - ${max}${suffix}`;

const rangeOf = (values: number[], suffix = "") =>
  formatRange(Math.min(...values), Math.max(...values), suffix);

const feeLabel = (fee: number) => (fee === 0 ? "Free" : `${fee}%`);

const feeRangeOf = (values: number[]) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? feeLabel(min) : `${feeLabel(min)} - ${feeLabel(max)}`;
};

const fallbackPlatinumBins = [binCards.platinum, binCards.platinumBasic];

const TermsAndConditions = () => {
  const { data: bins } = useGetBIN();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0]);

  const liveSapphireBin = ((bins ?? []) as any[]).find(
    (b) => b.provider === "int" && b.isActive !== false,
  );
  const sapphireBin = liveSapphireBin ?? binCards.sapphire;
  const sapphirePrice = Number(sapphireBin.price);
  const sapphireTopUpFee = Number(sapphireBin.topUpFee);

  const livePlatinumBins = ((bins ?? []) as any[]).filter(
    (b) => b.provider !== "int" && b.isActive !== false,
  );
  const platinumBins =
    livePlatinumBins.length > 0 ? livePlatinumBins : fallbackPlatinumBins;

  const platinumDefaultPriceRange = rangeOf(
    platinumBins.map((b: any) => Number(b.defaultPrice ?? b.price)),
  );
  const platinumCustomPriceRange = rangeOf(
    platinumBins.map((b: any) => Number(b.price)),
  );
  const platinumTopUpFeeRange = feeRangeOf(
    platinumBins.map((b: any) => Number(b.topUpFee)),
  );

  return (
    <div>
      {" "}
      <div className="text-white">
        <h3 className="font-semibold">Terms & Conditions</h3>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-[#6EF7FF2E] p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`h-8 flex-1 rounded-full text-xs font-medium transition-colors ${
                activeTab === tab
                  ? "bg-dark-primary-main text-[#242424]"
                  : "text-dark-text-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Infinite Card" && (
          <>
            <h4 className="mt-6 text-xs font-semibold lg:mt-4">
              Supported Usage Scenarios
            </h4>

            <p className="mt-2 text-xs leading-5 font-light">
              The card DOES NOT currently support Uber, Petrol stations, Talabat,
              Hermes Amsterdam, Hermes Paris, and Iberia and a few other
              merchants.
            </p>
            <h4 className="mt-4 text-xs font-semibold">Card information </h4>
            <ol className="list-decimal pl-8 text-xs leading-4 *:font-light">
              <li>Card Issuer: Visa</li>
              <li>Card Type: Credit</li>
              <li>Card Form: Virtual</li>
              <li>Currency: USD</li>
              <li>Apple Pay supported: Yes</li>
              <li>Google Wallet supported: Yes</li>
            </ol>
            <h4 className="mt-4 text-xs font-semibold">Fees</h4>
            <p className="text-xs leading-5 font-light">
              Card Purchase Fee: {sapphirePrice} USD
            </p>
            <p className="text-xs leading-5 font-light">
              Card Funding Fee: {feeLabel(sapphireTopUpFee)}
            </p>
            <p className="text-xs leading-5 font-light">
              FX Fee: This can vary and only applies if a crossborder
              transaction or the billing currency is different from the
              settlement currency.
            </p>

            <h4 className="mt-4 text-xs font-semibold">Credit Limits</h4>
            <ol className="list-decimal pl-8 text-xs leading-4 font-light">
              <li>Maximum Deposit: $100,000 USD</li>
              <li>Maximum Card Purchase Quantity: 10</li>
              <li>Initial Deposit Required: Yes</li>
            </ol>
            <h4 className="mt-4 text-xs font-semibold">Card Usage Notice</h4>
            <ol className="list-decimal pl-8 text-xs leading-4 font-light">
              <li>
                If the card issuer detects malicious activities, such as bulk
                refunds, cancellations, failures or chargebacks during card
                usage, the card will be automatically frozen, and a fee of $50
                USD per occurrence will be deducted.
              </li>
              <li>
                If the overall transaction failure rate exceeds 20%, the card
                will be automatically frozen.
              </li>
              <li>
                If the card has insufficient balance and accumulates up to 3
                consecutive authorization failures, the card will be
                automatically cancelled.
              </li>
              <li>
                If the card is frozen, please contact customer service to apply
                for unfreezing.
              </li>
              <li>The card is valid for 1 years.</li>
            </ol>
            <p className="mt-4 text-xs leading-5 font-light">
              <span className="font-medium">Card Currency:</span> Card currency
              refers to the currency type or unit associated with infinity
              cards. it plays a crucial role in determining the currency used
              for payment and settlement when utilising Krypt Kard cards. It is
              highly recommended to utilise cards that align with the currency
              of the purchase order to mitigate the potential incurring of FX
              fees.
            </p>
            <p className="mt-2 text-xs leading-5 font-light">
              For customers with monthly transaction volumes exceeding 500,000
              USD, please contact the support team for fee adjustments.
            </p>
          </>
        )}

        {activeTab === "Platinum Card" && (
          <>
            <h4 className="mt-6 text-xs font-semibold lg:mt-4">
              Supported Usage Scenarios
            </h4>
            <p className="mt-2 text-xs leading-5 font-light">
              The card SUPPORTS Uber, petrol stations, YouTube, AliExpress,
              Amazon, Iberia, Talabat.
            </p>
            <h4 className="mt-4 text-xs font-semibold">Card information</h4>
            <ol className="list-decimal pl-8 text-xs leading-4 *:font-light">
              <li>Card Issuer: Visa / MasterCard</li>
              <li>Card Type: Prepaid</li>
              <li>Card Form: Virtual</li>
              <li>Currency: USD</li>
              <li>Apple Pay supported: Yes</li>
              <li>Google Wallet supported: Yes</li>
            </ol>
            <h4 className="mt-4 text-xs font-semibold">Fees</h4>
            <p className="text-xs leading-5 font-light">
              Card Purchase Fee (Default): {platinumDefaultPriceRange} USD
            </p>
            <p className="text-xs leading-5 font-light">
              Card Purchase Fee (Custom): {platinumCustomPriceRange} USD
            </p>
            <p className="text-xs leading-5 font-light">
              Card Funding Fee: {platinumTopUpFeeRange}
            </p>
            <p className="text-xs leading-5 font-light">
              FX Fee: This can vary and only applies if a crossborder
              transaction or the billing currency is different from the
              settlement currency.
            </p>
            <h4 className="mt-4 text-xs font-semibold">Credit Limits</h4>
            <ol className="list-decimal pl-8 text-xs leading-4 font-light">
              <li>Maximum Deposit: $1,000,000 USD</li>
              <li>Maximum Card Purchase Quantity: 10</li>
              <li>Initial Deposit Required: Yes (minimum $1)</li>
            </ol>
            <h4 className="mt-4 text-xs font-semibold">Card Usage Notice</h4>
            <ol className="list-decimal pl-8 text-xs leading-4 font-light">
              <li>
                If the card issuer detects malicious activities, such as bulk
                refunds, cancellations, failures or chargebacks during card
                usage, the card will be automatically frozen, and a fee of $50
                USD per occurrence will be deducted.
              </li>
              <li>
                If the overall transaction failure rate exceeds 20%, the card
                will be automatically frozen.
              </li>
              <li>
                If the card has insufficient balance and accumulates up to 3
                consecutive authorization failures, the card will be
                automatically cancelled.
              </li>
              <li>
                If the card is frozen, please contact customer service to apply
                for unfreezing.
              </li>
              <li>The card is valid for 1 year.</li>
            </ol>
            <p className="mt-4 text-xs leading-5 font-light">
              <span className="font-medium">Card Currency:</span> It is highly
              recommended to utilise cards that align with the currency of the
              purchase order to mitigate the potential incurring of FX fees.
            </p>
            <p className="mt-2 text-xs leading-5 font-light">
              For customers with monthly transaction volumes exceeding 500,000
              USD, please contact the support team for fee adjustments.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default TermsAndConditions;

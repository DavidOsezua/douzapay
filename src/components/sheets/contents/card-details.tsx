import Copy from "../../copy";
import { useGetCardDetails } from "@/hooks/use-queries";

const CardDetails = ({ cardData }: { cardData: Card }) => {
  const { data: cardDetails } = useGetCardDetails({
      id: cardData.id,
      enabled: cardData.id !== null,
    });

  return (
    <div>
      {/* Main Content */}
      <div className="text-white mt-4 px-2">
        <div className="mt-4 flex items-center justify-between">
          <h3>Your Virtual Card Details</h3>
          {cardData.network === "VISA" || cardData.network === "Visa" ? (
            <img src="/images/visa.svg" alt="" />
          ) : (
            <img src="/images/mastercard-logo.svg" alt="" />
          )}
        </div>

        <div className="text-dark-text-400 bg-dark-input mt-4 inline-block px-4 py-2 text-sm">
          About this card
        </div>
        {/* Card Details */}
        <div className="mt-4 mb-10">
          <DetailRow
            label="Card Name"
            value={cardData.firstName + " " + cardData.lastName}
          />
          <DetailRow
            label={"Card Number"}
            value={
              cardDetails?.cardNo
                ? cardDetails.cardNo.replace(/(.{4})/g, "$1 ").trim()
                : undefined
            }
          />
          <DetailRow label={`CVV`} value={cardDetails?.cvv} />
          <DetailRow
            label={`Expiry Date`}
            value={cardDetails?.expMonth + "/" + cardDetails?.expYear}
          />
          <DetailRow
            label={`Address`}
            value={
              cardData.billingAddress
                ? [
                    cardData.billingAddress.addressLine1,
                    cardData.billingAddress.city,
                    cardData.billingAddress.state,
                    cardData.billingAddress.country,
                  ]
                    .filter(Boolean)
                    .join(", ")
                : undefined
            }
          />

          <DetailRow
            label="Zip Code"
            value={cardData.billingAddress?.postalCode}
          />
        </div>
      </div>
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value?: string | number;
  valueComponent?: React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  valueComponent,
}) => {
  return (
    <div className="border-black/10 pt-2 pb-2">
      <div>
        <div className="text-text-neutral text-sm capitalize">{label}</div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium capitalize">
          {valueComponent ? valueComponent : value}
        </span>
        <Copy icon="/icons/copy-light.svg" side="left" text={value as string} />
      </div>
    </div>
  );
};

export default CardDetails;

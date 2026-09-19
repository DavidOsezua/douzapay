import TopBar from "@/components/topbar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect } from "react";

const partnerOffers = [
  {
    name: "Football Match",
    upcoming: true,
    percentDiscount: 20,
    imagePath: "/patners/pm-league.png",
    category: "Event",
    notes: "Limited-time offer for match tickets",
  },
  {
    name: "J Hus Concert",
    upcoming: true,
    percentDiscount: 15,
    imagePath: "/patners/concert.png",
    category: "Event",
    notes: "Live performance discount",
  },
  {
    name: "Charles Leclerc Racing",
    upcoming: true,
    percentDiscount: 15,
    imagePath: "/patners/racing.png",
    category: "Event",
    notes: "Motorsport event promo",
  },
  {
    name: "Spotify",
    upcoming: false,
    percentDiscount: 25,
    imagePath: "/patners/spotify.png",
    category: "Streaming",
    notes: "Includes code '240 < 173' (possibly a promo or internal reference)",
  },
  {
    name: "YouTube Music",
    upcoming: false,
    percentDiscount: 20,
    imagePath: "/patners/youtube-music.png",
    category: "Streaming",
  },
  {
    name: "SoundCloud",
    upcoming: false,
    percentDiscount: 25,
    imagePath: "/patners/soundcloud.png",
    category: "Streaming",
  },
  {
    name: "Netflix",
    upcoming: false,
    percentDiscount: 10,
    imagePath: "/patners/netflix.png",
    category: "Streaming",
  },
];

const Partners = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div>
      {/* header */}
      <TopBar title={`Partners`} />

      <div className="relative px-4 py-4 text-white">
        {/* <img
          src="/images/bg-logo.svg"
          alt=""
          className="fixed right-2/5 bottom-[calc(50%-100px)] z-0 translate-x-1/2 translate-y-1/2"
        /> */}
        <div

          className="rounded-md px-4 py-2.5 bg-dark-card-3"
        >
          <p className="text-sm lg:text-xl">
            Shop with our partners and get DISCOUNT on your purchase Now!!
          </p>
          <div className="relative mt-2">
            <Search className="absolute bottom-1/2 left-4 z-9 size-3.5 translate-y-1/2" />
            <Input
              type="search"
              className="h-11 w-full border border-[#2D3351] bg-white/10 pl-10 backdrop-blur-xs placeholder:font-light placeholder:text-dark-text-300"
              placeholder="Search partners"
            />
          </div>
        </div>

        {/* cards */}
        <div className="relative mt-6 grid w-full grid-cols-2 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
          {partnerOffers.map((offer, index) => (
            <PartnerCard partner={offer} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

type Partner = {
  name: string;
  upcoming: boolean;
  percentDiscount: number;
  imagePath: string;
  category: string;
};

const PartnerCard = ({ partner }: { partner: Partner }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <div className="relative h-28 w-full lg:h-48">
        <img
          src={partner.imagePath}
          alt=""
          className="relative h-full w-full object-cover"
        />
        <div
          className="0 absolute inset-0 z-1 flex h-full w-full text-white items-center justify-center backdrop-blur-xs"
          style={{
            background:
              " linear-gradient(129.49deg, rgba(69, 76, 111, 0.2) 3.6%, rgba(95, 104, 149, 0.2) 100%)",
          }}
        >
          Coming Soon
        </div>
      </div>
      <div
        className="flex h-12 items-center px-4 text-sm text-white backdrop-blur-sm lg:text-base"
        style={{
          background:
            "linear-gradient(123.04deg, rgba(44, 123, 127, 0.4) 1.64%, rgba(23, 154, 161, 0.4) 98.52%)",
        }}
      >
        Get up to {partner.percentDiscount}% OFF
      </div>
    </div>
  );
};

export default Partners;

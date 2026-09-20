import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

/** Small inline chip + contactless glyphs for the CSS-drawn card */
const CardChip = () => (
  <svg width="38" height="28" viewBox="0 0 38 28" fill="none" aria-hidden="true">
    <rect
      x="0.5"
      y="0.5"
      width="37"
      height="27"
      rx="5.5"
      fill="url(#chip-grad)"
      stroke="#E1E1E1"
      strokeOpacity="0.4"
    />
    <path
      d="M13 0.5V10.5C13 12.5 11.5 14 9.5 14H0.5M13 27.5V17.5C13 15.5 11.5 14 9.5 14M25 0.5V10.5C25 12.5 26.5 14 28.5 14H37.5M25 27.5V17.5C25 15.5 26.5 14 28.5 14"
      stroke="#E1E1E1"
      strokeOpacity="0.45"
    />
    <defs>
      <linearGradient
        id="chip-grad"
        x1="0"
        y1="0"
        x2="38"
        y2="28"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#CECECE" stopOpacity="0.45" />
        <stop offset="1" stopColor="#E1E1E1" stopOpacity="0.35" />
      </linearGradient>
    </defs>
  </svg>
);

const ContactlessIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path
      d="M5.5 7.5a7.5 7.5 0 0 1 0 7M9 5.5a11 11 0 0 1 0 11M12.5 3.5a14.5 14.5 0 0 1 0 15"
      stroke="#B9BCCC"
      strokeOpacity="0.55"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-dark-background-main relative min-h-screen overflow-hidden">
      <img
        src="/images/bg-logo.svg"
        alt=""
        className="fixed top-8 left-1/2 z-0 -translate-x-1/2 opacity-60"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Floating glassy card, drawn entirely with CSS + inline SVG */}
        <div className="relative mb-10">
          {/* soft glow behind the card */}
          <div
            className="absolute top-1/2 left-1/2 h-40 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, #E1E1E1 0%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          <div className="notfound-float relative h-44 w-72 sm:h-48 sm:w-80">
            <div
              className="relative h-full w-full overflow-hidden rounded-2xl border border-[#CECECE2E] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(225,225,225,0.15)] backdrop-blur-sm"
              style={{
                background:
                  "linear-gradient(129.49deg, rgba(140, 140, 140, 0.35) 3.6%, rgba(24, 24, 24, 0.95) 100%)",
              }}
            >
              {/* diagonal sheen */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.03) 55%, transparent 70%)",
                }}
                aria-hidden="true"
              />
              {/* faint corner orb */}
              <div
                className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full opacity-30 blur-2xl"
                style={{ background: "#E1E1E1" }}
                aria-hidden="true"
              />

              <div className="relative flex h-full flex-col justify-between p-5">
                <div className="flex items-start justify-between">
                  <CardChip />
                  <ContactlessIcon />
                </div>

                <p className="font-mont text-lg font-semibold tracking-[0.2em] text-[#E1E1E1] [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] sm:text-xl">
                  4040 0404 4040
                </p>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] tracking-[0.25em] text-[#B9BCCC]/60 uppercase">
                      Cardholder
                    </p>
                    <p className="text-xs font-medium tracking-widest text-[#E1E1E1]/90 uppercase">
                      Page Not Found
                    </p>
                  </div>
                  {/* overlapping network circles */}
                  <div className="flex" aria-hidden="true">
                    <span className="size-6 rounded-full bg-[#E1E1E1]/40" />
                    <span className="-ml-2.5 size-6 rounded-full bg-[#CECECE]/25" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-white">
          <p className="mb-2 text-xs font-medium tracking-[0.3em] text-[#E1E1E1]/70 uppercase">
            Error 404
          </p>
          <h1 className="mb-3 text-2xl font-semibold sm:text-3xl">
            Page not found
          </h1>
          <p className="mx-auto mb-8 max-w-md text-sm leading-5 text-white/70">
            The link you followed doesn&apos;t point to anything here. It may
            have been moved, or it never existed in the first place.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="sm"
              className="w-full justify-center border border-[#CECECE2E] text-white hover:bg-white/10 sm:w-auto"
            >
              <ArrowLeft className="size-4" />
              Go Back
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link
                to="/dashboard"
                className="w-full justify-center border border-[#CECECE2E] text-white hover:bg-white/10 sm:w-auto"
              >
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

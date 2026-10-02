import { IconProps } from "./type";

// Duotone wallet, tinted via `currentColor` so it reads on both dark and
// light backgrounds.
const WalletIcon = ({ className }: IconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        opacity="0.4"
        d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
        fill="currentColor"
      />
      <path
        d="M14.85 3.95012V7.75011H6.26C4.19 7.75011 2.5 9.44012 2.5 11.5101V7.84014C2.5 6.65014 3.23 5.59009 4.34 5.17009L12.28 2.17009C13.52 1.71009 14.85 2.62012 14.85 3.95012Z"
        fill="currentColor"
      />
      <path
        d="M22.56 13.9699V16.03C22.56 16.58 22.12 17.0299 21.56 17.0499H19.6C18.52 17.0499 17.53 16.2599 17.44 15.1799C17.38 14.5499 17.62 13.9599 18.04 13.5499C18.41 13.1699 18.92 12.95 19.48 12.95H21.56C22.12 12.97 22.56 13.4199 22.56 13.9699Z"
        fill="currentColor"
      />
      <path
        d="M14 12.75H7C6.59 12.75 6.25 12.41 6.25 12C6.25 11.59 6.59 11.25 7 11.25H14C14.41 11.25 14.75 11.59 14.75 12C14.75 12.41 14.41 12.75 14 12.75Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default WalletIcon;

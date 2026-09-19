import { IconProps } from "./type";

const ArrowIcon = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      width="8"
      height="11"
      viewBox="0 0 8 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.4659 0.757863L2.29473 9.71458ZM0.606373 4.75904L2.04849 10.1411L7.43054 8.69897"
        fill="currentColor"
      />
      <path
        d="M7.4659 0.757863L2.29473 9.71458M0.606373 4.75904L2.04849 10.1411L7.43054 8.69897"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowIcon;

import { IconProps } from "./type";

const DepositIcon = (_props: IconProps) => {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <foreignObject x="0" y="0" width="0" height="0">
        <div xmlns="http://www.w3.org/1999/xhtml"></div>
      </foreignObject>
      <circle
        data-figma-bg-blur-radius="4"
        cx="25"
        cy="25"
        r="24.5"
        fill="#E1E1E1"
        stroke="#E1E1E1"
      />
      <path
        d="M28.4277 35.2861H18.142"
        stroke="#242424"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M31.1825 18.3339L18.4546 31.0618M17.8485 21.9704L17.8485 31.6679L27.546 31.6679"
        stroke="#242424"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <clipPath id="bgblur_0_259_33179_clip_path" transform="translate(0 0)">
          <circle cx="25" cy="25" r="24.5" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default DepositIcon;

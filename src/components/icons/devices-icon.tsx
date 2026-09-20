import { IconProps } from "./type";

const DevicesIcon = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      width="21"
      height="17"
      viewBox="0 0 21 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.5 11.5H2.5V2.5C2.5 1.96957 2.71071 1.46086 3.08579 1.08579C3.46086 0.710714 3.96957 0.5 4.5 0.5H16.5C17.0304 0.5 17.5391 0.710714 17.9142 1.08579C18.2893 1.46086 18.5 1.96957 18.5 2.5V4.5M0.5 14.5H12.5"
        stroke="#E1E1E1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 13.5H16.51M12.5 5.7C12.5 5.037 13.097 4.5 13.833 4.5H19.167C19.903 4.5 20.5 5.037 20.5 5.7V15.3C20.5 15.963 19.903 16.5 19.167 16.5H13.833C13.097 16.5 12.5 15.963 12.5 15.3V5.7Z"
        stroke="#E1E1E1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DevicesIcon;

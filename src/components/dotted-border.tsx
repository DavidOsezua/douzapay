export const DottedBorderBox = ({
  theme = "light",
  strokeColor,
  strokeWidth = 1,
  dashArray = "8 6",
  borderRadius = 12,
}) => {
  const resolvedStroke =
    strokeColor || (theme === "dark" ? "#3A3B3E" : "#E9E9E9");

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        fill: "none",
        stroke: resolvedStroke,
        strokeWidth,
        strokeDasharray: dashArray,
      }}
    >
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx={borderRadius}
        ry={borderRadius}
      />
    </svg>
  );
};

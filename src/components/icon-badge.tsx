import type { ReactNode } from "react";

const IconBadge = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#E1E1E1] text-[#242424]">
    {children}
  </div>
);

export default IconBadge;

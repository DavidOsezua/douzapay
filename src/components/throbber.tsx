import { Loader2 } from "lucide-react";

const Throbber = ({ className }: { className?: string }) => {
  return <Loader2 className={`animate-spin ${className}`} />;
};

export default Throbber;

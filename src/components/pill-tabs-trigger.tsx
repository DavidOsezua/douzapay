import { motion } from "framer-motion";
import { TabsTrigger } from "@/components/ui/tabs";

// A tab whose active background is a pill that glides between tabs. Tabs are
// only as wide as their padding makes them (no equal-width stretching), so the
// pill hugs each label. `active` must match the Tabs' current value; the
// shared layoutId is what makes the pill travel from one tab to the next.
const PillTabsTrigger = ({
  value,
  active,
  children,
}: {
  value: string;
  active: boolean;
  children: React.ReactNode;
}) => (
  <TabsTrigger
    value={value}
    className="relative flex-none rounded-full px-4 text-white/70 data-[state=active]:bg-transparent data-[state=active]:!text-[#242424] dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent dark:data-[state=active]:!text-[#242424]"
  >
    {active && (
      <motion.span
        layoutId="pill-tab-indicator"
        className="bg-dark-primary-main absolute -inset-px rounded-full"
        transition={{ type: "spring", stiffness: 500, damping: 38 }}
      />
    )}
    <span className="relative">{children}</span>
  </TabsTrigger>
);

export default PillTabsTrigger;

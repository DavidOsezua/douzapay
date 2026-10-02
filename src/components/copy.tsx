/* eslint-disable react/prop-types */
import { FC, useState } from "react";
import { motion } from "framer-motion";
import { CopyIcon } from "lucide-react";

interface CopyProps {
  text?: string;
  variant?: string;
  icon?: string;
  side?: string;
}

const Copy: FC<CopyProps> = ({
  text = "",
  variant = "default",
  icon = "",
  side = "right",
}) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="relative flex shrink-0 items-center justify-center">
      {isCopied && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          exit={{ opacity: 0 }}
          className={`absolute ${side === "left" ? "right-0" : "left-0"} bottom-full z-10 flex h-full min-h-6 shrink items-center justify-center rounded bg-black/80 px-2.5 py-1 text-xs text-white`}
        >
          Copied
        </motion.div>
      )}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 3000);
          navigator.clipboard.writeText(text);
        }}
        className="flex shrink-0 items-center justify-center cursor-pointer"
      >
        {icon ? (
          <img src={icon} className="size-4" alt="" />
        ) : variant === "white" ? (
          <CopyIcon size={15} color="white" />
        ) : (
          <img src="/icons/copy.svg" className="size-4" alt="copy icon" />
        )}
      </button>
    </div>
  );
};

export default Copy;

import type React from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export const ModalBackdrop = ({
  children,
  onClose,
  className,
  style,
}: {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed inset-0 z-30 flex h-dvh items-center justify-center backdrop-blur-lg ${className}`}
      style={style}
      onClick={onClose}
    >
      {children}
    </motion.div>
  );
};

export const Modal = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="font-urbanist h-auto max-w-100 rounded-2xl bg-white px-4 py-4 text-black lg:w-150"
    >
      {children}
    </motion.div>
  );
};

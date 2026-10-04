import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import SheetControlButton from "./sheet-control-button";
import InternalTransfer from "./contents/internal-transfer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useModalStore } from "@/zustand/modalStore";
import { useSheetStore } from "@/zustand/sheetStore";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

const InternalTransferSheet = () => {
  const { activeSheet, isOpen, step, setStep, closeSheet } = useSheetStore();
  const isMobile = useIsMobile();
  const open = isOpen && activeSheet === "internalTransfer";

  useEffect(() => {
    if (!open) return;
    lockScroll();
    return () => unlockScroll();
  }, [open]);

  // Escape closes the sheet, but only when open and no modal is on top
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key !== "Escape") return;
      if (useModalStore.getState().isOpen) return;
      closeSheet();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, closeSheet]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay — intentionally no onClick; outside clicks must not dismiss this sheet */}
          <motion.div
            key="it-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-black/50"
          />
          {/* Panel */}
          <motion.div
            key="it-panel"
            role="dialog"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="dark fixed inset-y-0 right-0 z-50 flex h-full flex-col overflow-y-auto bg-dark-background-secondary px-4 text-white shadow-lg"
            style={{
              width: isMobile ? "100%" : "465px",
              maxWidth: isMobile ? "100%" : "465px",
            }}
          >
            {/* Spacer mirrors SheetHeader height so content alignment matches other sheets */}
            <div className="flex flex-col gap-1.5 p-4" />
            <div className="h-full">
              <SheetControlButton
                closeSheet={closeSheet}
                currentStep={step}
                setStep={setStep}
              />
              <div className="relative">
                <div className="relative z-10 h-full">
                  <InternalTransfer step={step ?? 1} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default InternalTransferSheet;

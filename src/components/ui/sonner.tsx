import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-xl !border !border-white/[0.14] !bg-[#121212]/80 !text-white !shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),inset_1px_0_0_0_rgba(255,255,255,0.12),inset_0_-1px_0_0_rgba(255,255,255,0.05),0_12px_40px_rgba(0,0,0,0.35)] focus-visible:!shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),inset_1px_0_0_0_rgba(255,255,255,0.12),inset_0_-1px_0_0_rgba(255,255,255,0.05),0_12px_40px_rgba(0,0,0,0.35),0_0_0_2px_rgba(255,255,255,0.5)] !backdrop-blur-[7px] !backdrop-saturate-[1.6]",
          title: "!text-white",
          description: "!text-white/70",
          actionButton: "!bg-white/15 !text-white",
          cancelButton: "!bg-white/10 !text-white/70",
          closeButton: "!border-white/20 !bg-[#121212]/80 !text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

import type { ReactNode } from "react";
import { getFromLocalStorage } from "./helper";
import { toast } from "sonner";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const token = getFromLocalStorage("token");
  if (!token) {
    toast.error("Access Denied, login required");
    window.open("/login", "_self");
    return null;
  } else {
    return <div>{children}</div>;
  }
};

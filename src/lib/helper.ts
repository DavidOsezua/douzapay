import { toast } from "sonner";

/** Shape of the errors returned by the API (Axios error + backend payload). */
export interface ApiError {
  code?: string;
  response?: {
    status?: number;
    data?: {
      detail?: string;
      error?: string;
      message?: string;
    };
  };
}

const asApiError = (error: unknown): ApiError => (error ?? {}) as ApiError;

export const classifyCardIdProvider = (
  cardId?: string | null,
): "wsb" | "int" | "ptp" => {
  const id = (cardId ?? "").toLowerCase();
  if (id.startsWith("wb") || id.startsWith("wc")) return "wsb";
  if (id.includes("-")) return "int";
  return "ptp";
};

export function getFromLocalStorage(key: string) {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
}

export function handleError(error: unknown) {
  const err = asApiError(error);
  if (err.code === "ERR_NETWORK") {
    toast.error("Network Error");
    return;
  }
  if (
    err.response?.status === 401 &&
    window.location.pathname.split("/")[1] === "admin-dashboard"
  ) {
    localStorage.removeItem("token");
    toast.error("Access Denied, login required");
    window.location.href = "/admin-login";
    return;
  } else if (
    err.response?.status === 401 &&
    window.location.pathname.split("/")[1] === "dashboard"
  ) {
    localStorage.removeItem("token");
    toast.error("Access Denied, login required");
    window.location.href = "/login";
    return;
  }
  const { detail, error: errMsg, message } = err.response?.data ?? {};
  toast.error(
    detail ??
      (typeof errMsg === "string"
        ? errMsg
        : typeof message === "string"
          ? message
          : "An error occurred, Please try again"),
  );
}

const convertToCSV = (objArray: unknown) => {
  const array: any[] =
    typeof objArray !== "object"
      ? JSON.parse(objArray as string)
      : (objArray as any[]);
  let str = "";

  for (let i = 0; i < array.length; i++) {
    let line = "";
    for (let index in array[i]) {
      if (line !== "") line += ",";

      line += array[i][index];
    }
    str += line + "\r\n";
  }
  return str;
};

export const downloadCSV = (data: unknown, fileName: string) => {
  const csvData = new Blob([convertToCSV(data)], { type: "text/csv" });
  const csvURL = URL.createObjectURL(csvData);
  const link = document.createElement("a");
  link.href = csvURL;
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handleShare = (link: string) => {
  const baseUrl = window.location.origin;
  const referralPath = link;
  const fullUrl = `${baseUrl}/${referralPath}`;
  const shareText = `🎉 Join me on KrypKard and get started with smarter banking! Use my referral link to sign up and enjoy exclusive benefits: 👉 ${fullUrl}`;

  if (navigator.share) {
    navigator.share({
      title: "Join KrypKard",
      text: shareText,
      url: fullUrl,
    });
  } else {
    alert("Sharing not supported on this browser.");
  }
};

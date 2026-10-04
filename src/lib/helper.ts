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

export const downloadBlob = (blob: Blob, filename: string) => {
  // Safari treats a blob: URL by its Content-Type, not the `download`
  // attribute — for application/pdf it can navigate the tab to an inline
  // preview instead of saving the file, which also takes out the SPA (and
  // whatever "download complete" UI was meant to follow). Re-wrapping as a
  // generic binary type stops that; the filename's own extension still
  // determines what the saved file opens as.
  const forcedBlob = blob.type.toLowerCase().startsWith("application/pdf")
    ? new Blob([blob], { type: "application/octet-stream" })
    : blob;
  const url = URL.createObjectURL(forcedBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  // Belt-and-suspenders: if some browser still decides to navigate instead
  // of download, this sends that navigation to a new tab so the current one
  // (and the app state in it) survives.
  link.target = "_blank";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Deferred so Safari has time to start the download before the URL is freed.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// axios with `responseType: "blob"` wraps error bodies in a Blob too, so
// handleError() can't read `detail` off them. Unwrap to a plain object first.
export async function normalizeBlobError(error: unknown): Promise<unknown> {
  const err = error as { response?: { data?: unknown } };
  const data = err?.response?.data;
  if (!(data instanceof Blob)) return error;
  const text = await data.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { detail: text || undefined };
  }
  return { ...(error as object), response: { ...err.response, data: parsed } };
}

export const handleShare = (link: string) => {
  const baseUrl = window.location.origin;
  const referralPath = link;
  const fullUrl = `${baseUrl}/${referralPath}`;
  const shareText = `🎉 Join me on Duozapay and get started with smarter banking! Use my referral link to sign up and enjoy exclusive benefits: 👉 ${fullUrl}`;

  if (navigator.share) {
    navigator.share({
      title: "Join Duozapay",
      text: shareText,
      url: fullUrl,
    });
  } else {
    alert("Sharing not supported on this browser.");
  }
};

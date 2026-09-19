import { toast } from "sonner";

export function getFromLocalStorage(key) {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
}

export function handleError(error) {
  if (error.code === "ERR_NETWORK") {
    toast.error("Network Error");
    return;
  }
  if (
    error?.response?.status === 401 &&
    window.location.pathname.split("/")[1] === "admin-dashboard"
  ) {
    localStorage.removeItem("token");
    toast.error("Access Denied, login required");
    window.location.href = "/admin-login";
    return;
  } else if (
    error?.response?.status === 401 &&
    window.location.pathname.split("/")[1] === "dashboard"
  ) {
    localStorage.removeItem("token");
    toast.error("Access Denied, login required");
    window.location.href = "/login";
    return;
  }
  const { detail, error: err, message } = error?.response?.data ?? {};
  toast.error(
    detail ??
      (typeof err === "string"
        ? err
        : typeof message === "string"
          ? message
          : "An error occurred, Please try again"),
  );
}

const convertToCSV = (objArray) => {
  const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
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

export const downloadCSV = (data, fileName) => {
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
  const shareText = `🎉 Join me on Krypt Kard and get started with smarter banking! Use my referral link to sign up and enjoy exclusive benefits: 👉 ${fullUrl}`;

  if (navigator.share) {
    navigator.share({
      title: "Join Krypt Kard",
      text: shareText,
      url: fullUrl,
    });
  } else {
    alert("Sharing not supported on this browser.");
  }
};

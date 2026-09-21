import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CountryCodeSelect } from "@/lib/country-code-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ModalBackdrop } from "@/components/modals/modal-backdrop";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateCardholder } from "@/hooks/use-mutations";
import { uploadFile } from "@/lib/api";
import { handleError } from "@/lib/helper";
import {
  useGetCardholderCountries,
  useGetCardholderCities,
} from "@/hooks/use-queries";
import Throbber from "@/components/throbber";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const STEPS = ["Personal", "Address", "Employment", "Identity"] as const;

const DOCUMENT_TYPES = [
  "Passport",
  "Driver Licence",
  "National",
  "Residence Permit",
] as const;

const DOC_TYPE_MAP: Record<string, string> = {
  Passport: "PASSPORT",
  "Driver Licence": "DLN",
  National: "GOVERNMENT_ISSUED_ID_CARD",
  "Residence Permit": "HK_HKID",
};

const inputClass =
  "h-11 rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white placeholder:text-white/50";

const selectClass =
  "!h-11 w-full overflow-hidden rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white data-[placeholder]:text-white/50";

const dateClass =
  "h-11 w-full max-w-full min-w-0 rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#6C95F6]";

const ACTIVE_BG = "#6C95F6";
const STEP_COMPLETE_BG =
  "linear-gradient(128.62deg, #E3F7FF 11.02%, #D3BBF1 93.11%)";

function UploadButton({
  label,
  subtitle,
  file,
  onOpen,
}: {
  label: string;
  subtitle: string;
  file: File | null;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-2xl border border-dashed px-4 py-3.5 transition-opacity hover:opacity-90"
      style={{ borderColor: "#62D1F3", background: "#F7FDFF" }}
    >
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-dashed bg-[#F0FBFF]"
        style={{ borderColor: "#62D1F3" }}
      >
        <Upload size={16} color="#62D1F3" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-dark-text-400 text-sm font-semibold">{label}</p>
        <p className="text-dark-text-300 text-xs">
          {file ? file.name : subtitle}
        </p>
      </div>
      <ChevronRight size={16} className="text-dark-text-300" />
    </button>
  );
}

const CreateCardholder = ({
  closeSheet,
  binId,
}: {
  closeSheet: () => void;
  setStep: (value: number) => void;
  step: number;
  binId?: string | number;
}) => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [innerStep, setInnerStep] = useState(0);
  // Dial code (digits only, e.g. "81"). CountryCodeSelect calls setCountryCode
  // with the selected country's dialCode; it seeds "1" (US) on mount.
  const [countryCode, setCountryCode] = useState("1");
  const [frontIdFile, setFrontIdFile] = useState<File | null>(null);
  const [backIdFile, setBackIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [activeUpload, setActiveUpload] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frontIdRef = useRef<HTMLInputElement>(null);
  const backIdRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);
  const frontIdCamRef = useRef<HTMLInputElement>(null);
  const backIdCamRef = useRef<HTMLInputElement>(null);
  const selfieCamRef = useRef<HTMLInputElement>(null);

  const deviceRefMap: Record<
    string,
    React.RefObject<HTMLInputElement | null>
  > = { "Front ID": frontIdRef, "Back ID": backIdRef, Selfie: selfieRef };
  const cameraRefMap: Record<
    string,
    React.RefObject<HTMLInputElement | null>
  > = {
    "Front ID": frontIdCamRef,
    "Back ID": backIdCamRef,
    Selfie: selfieCamRef,
  };
  const setFileMap: Record<string, (f: File | null) => void> = {
    "Front ID": setFrontIdFile,
    "Back ID": setBackIdFile,
    Selfie: setSelfieFile,
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
    setCapturedImageUrl(null);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      setCapturedImageUrl(null);
    } catch {
      toast.error("Could not access camera");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    setCapturedImageUrl(canvas.toDataURL("image/jpeg", 0.92));
  };

  const proceedWithCapture = async () => {
    if (!capturedImageUrl || !activeUpload) return;
    const res = await fetch(capturedImageUrl);
    const blob = await res.blob();
    const file = new File([blob], `${activeUpload.replace(/\s+/g, "_")}.jpg`, {
      type: "image/jpeg",
    });
    setFileMap[activeUpload](file);
    stopCamera();
    setActiveUpload(null);
  };

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  useEffect(() => {
    if (!activeUpload) stopCamera();
  }, [activeUpload]);

  const { mutateAsync: submitCardholder, isPending: isCreating } =
    useCreateCardholder({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cardholders"] });
        closeSheet();
      },
    });

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      nationality: "",
      streetAddress: "",
      apartment: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      gender: "",
      cardPurpose: "",
      employmentStatus: "",
      occupation: "",
      annualIncome: "",
      expectedMonthlyVolume: "",
      documentType: "Passport",
      documentNumber: "",
      issueDate: "",
      idExpiryDate: "",
    },
  });

  const { data: countriesData, isLoading: isLoadingCountries } =
    useGetCardholderCountries();
  const countries: { code: string; name: string }[] = countriesData?.data ?? [];

  const watchedCountry = form.watch("country");
  const watchedState = form.watch("state");
  const { data: citiesData, isLoading: isLoadingCities } =
    useGetCardholderCities(watchedCountry);
  const regions: {
    code: string;
    name: string;
    children: { code: string; name: string }[];
  }[] = citiesData?.data ?? [];
  const availableCities =
    regions.find((r) => r.code === watchedState)?.children ?? [];

  const onContinue = form.handleSubmit(() => {
    if (innerStep < STEPS.length - 1) setInnerStep((s) => s + 1);
  });

  const onFinalSubmit = form.handleSubmit(async (data) => {
    if (!frontIdFile || !backIdFile) {
      toast.error("Please upload both Front and Back ID");
      return;
    }
    if (!selfieFile) {
      toast.error("Please upload a selfie");
      return;
    }
    // Normalise the phone to a bare national number: strip spaces/symbols, a
    // "00" international prefix, a leading country code the user pasted in, and
    // the national trunk "0". The provider expects areaCode + national digits.
    const dialDigits = String(countryCode).replace(/\D/g, "");
    let phoneDigits = String(data.phone).replace(/\D/g, "").replace(/^00/, "");
    if (
      dialDigits &&
      phoneDigits.startsWith(dialDigits) &&
      phoneDigits.length - dialDigits.length >= 6
    ) {
      phoneDigits = phoneDigits.slice(dialDigits.length);
    }
    phoneDigits = phoneDigits.replace(/^0+/, "");

    if (
      !dialDigits ||
      phoneDigits.length < 6 ||
      `${dialDigits}${phoneDigits}`.length > 15
    ) {
      toast.error("Enter a valid phone number (without the leading 0)");
      setInnerStep(0);
      return;
    }

    let ipAddress = "";
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const json = await res.json();
      ipAddress = json.ip ?? "";
    } catch {
      // proceed without IP
    }

    let documentFrontId: string;
    let documentBackId: string;
    let selfieId: string;
    try {
      setIsUploading(true);
      [documentFrontId, documentBackId, selfieId] = await Promise.all([
        uploadFile(frontIdFile, binId),
        uploadFile(backIdFile, binId),
        uploadFile(selfieFile, binId),
      ]);
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      handleError(error);
      return;
    }

    // submitCardholder surfaces its own failures via useCreateCardholder's
    // onError → handleError; catch here only to swallow the rejection.
    try {
      await submitCardholder({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        areaCode: `+${dialDigits}`,
        phone: phoneDigits,
        birthday: data.dateOfBirth,
        nationality: data.nationality,
        gender: data.gender === "Male" ? "M" : "F",
        address:
          data.streetAddress + (data.apartment ? ` ${data.apartment}` : ""),
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        occupation: data.occupation,
        annualSalary: data.annualIncome,
        accountPurpose: data.cardPurpose,
        expectedMonthlyVolume: data.expectedMonthlyVolume,
        idType: DOC_TYPE_MAP[data.documentType] ?? "PASSPORT",
        idNumber: data.documentNumber,
        issueDate: data.issueDate,
        idExpiryDate: data.idExpiryDate,
        binId: String(binId ?? ""),
        ipAddress,
        idFrontId: documentFrontId,
        idBackId: documentBackId,
        idHoldId: selfieId,
      });
    } catch {
      // handled by useCreateCardholder onError
    }
  });

  // Shared button styles
  const primaryBtn =
    "flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white";
  const backBtn =
    "flex items-center gap-1.5 rounded-2xl border border-[#E1E5EB] bg-[#FBFBFB] px-5 py-3.5 text-sm font-semibold text-dark-text-400";

  const activeToggleStyle = {
    backgroundColor: ACTIVE_BG,
    borderColor: ACTIVE_BG,
    color: "#fff",
  };
  const inactiveToggleStyle = {
    backgroundColor: "#FBFBFB",
    borderColor: "#E1E5EB",
    color: "var(--dark-text-400, #374151)",
  };

  return (
    <div className="flex h-full flex-col">
      <h2 className="text-white mb-5 text-lg font-semibold">
        Create a Cardholder
      </h2>

      {/* Step progress */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-dark-text-300 text-xs">
            Step {innerStep + 1} of {STEPS.length}
          </span>
          <span className="text-dark-primary-main text-xs font-medium">
            {STEPS[innerStep]}
          </span>
        </div>
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                background:
                  i <= innerStep ? STEP_COMPLETE_BG : "rgba(0,0,0,0.08)",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── STEP 1 — Personal ── */}
      {innerStep === 0 && (
        <div className="flex flex-1 flex-col">
          <div className="mb-4">
            <h3 className="text-white text-base font-semibold">
              Personal details
            </h3>
            <p className="text-dark-text-300 text-xs">
              Must match your government-issued ID
            </p>
          </div>
          <form className="flex flex-1 flex-col" onSubmit={onContinue}>
            <Form {...form}>
              <div className="flex-1 space-y-3">
                <div className="flex gap-3">
                  <FormField
                    name="firstName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="min-w-0 flex-1">
                        <FormLabel className="text-white text-xs font-normal">
                          First Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="First Name"
                            className={inputClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="lastName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="min-w-0 flex-1">
                        <FormLabel className="text-white text-xs font-normal">
                          Last Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Last Name"
                            className={inputClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter email"
                          className={inputClass}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="phone"
                  control={form.control}
                  rules={{
                    required: "Phone number is required",
                    validate: (value) => {
                      const digits = String(value ?? "")
                        .replace(/\D/g, "")
                        .replace(/^0+/, "");
                      if (digits.length < 6)
                        return "Enter a valid phone number";
                      if (`${countryCode}${digits}`.length > 15)
                        return "Phone number is too long";
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Phone <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <CountryCodeSelect
                            className="text-white h-11 w-full rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)]"
                            onSelect={setCountryCode}
                          />
                          <Input
                            {...field}
                            type="tel"
                            inputMode="numeric"
                            placeholder="000 0000 0000"
                            className={inputClass}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value.replace(/[^\d\s+-]/g, ""),
                              )
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="dateOfBirth"
                  control={form.control}
                  rules={{
                    required: "Date of birth is required",
                    validate: (value) => {
                      if (!value) return "Date of birth is required";
                      const today = new Date();
                      const dob = new Date(value);
                      const age =
                        today.getFullYear() -
                        dob.getFullYear() -
                        (today <
                        new Date(
                          today.getFullYear(),
                          dob.getMonth(),
                          dob.getDate(),
                        )
                          ? 1
                          : 0);
                      if (age < 18) return "You must be at least 18 years old";
                      if (age > 100) return "Age cannot exceed 100 years";
                      return true;
                    },
                  }}
                  render={({ field }) => {
                    const today = new Date();
                    const maxDate = new Date(
                      today.getFullYear() - 18,
                      today.getMonth(),
                      today.getDate(),
                    )
                      .toISOString()
                      .split("T")[0];
                    const minDate = new Date(
                      today.getFullYear() - 100,
                      today.getMonth(),
                      today.getDate(),
                    )
                      .toISOString()
                      .split("T")[0];
                    return (
                      <FormItem>
                        <FormLabel className="text-white text-xs font-normal">
                          Date of Birth <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="w-full overflow-hidden">
                            <input
                              type="date"
                              className={dateClass}
                              value={field.value || ""}
                              onChange={field.onChange}
                              min={minDate}
                              max={maxDate}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  name="nationality"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Nationality <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoadingCountries}
                        >
                          <SelectTrigger className={selectClass}>
                            <SelectValue
                              placeholder={
                                isLoadingCountries ? "Loading…" : "Select"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {countries.map((c) => (
                                <SelectItem key={c.code} value={c.code}>
                                  <span className="flex items-center gap-2">
                                    <img
                                      src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                                      alt={c.name}
                                      className="inline-block size-4"
                                    />
                                    {c.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="gender"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Gender <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2">
                          {["Male", "Female"].map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => field.onChange(g)}
                              className="h-11 rounded-xl border text-sm font-medium transition-all duration-150"
                              style={
                                field.value === g
                                  ? activeToggleStyle
                                  : inactiveToggleStyle
                              }
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6 pb-6">
                <button
                  type="submit"
                  className={primaryBtn}
                  style={{ backgroundColor: "#4A93DB" }}
                >
                  Continue
                  <ChevronRight size={16} />
                </button>
              </div>
            </Form>
          </form>
        </div>
      )}

      {/* ── STEP 2 — Address ── */}
      {innerStep === 1 && (
        <div className="flex flex-1 flex-col">
          <div className="mb-4">
            <h3 className="text-white text-base font-semibold">
              Residential address
            </h3>
            <p className="text-dark-text-300 text-xs">
              Used for identity verification
            </p>
          </div>
          <form className="flex flex-1 flex-col" onSubmit={onContinue}>
            <Form {...form}>
              <div className="flex-1 space-y-3">
                <FormField
                  name="streetAddress"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Street Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter street address"
                          className={inputClass}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="apartment"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Apartment / Suite
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Optional"
                          className={inputClass}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="country"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Country <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("state", "");
                            form.setValue("city", "");
                          }}
                          disabled={isLoadingCountries}
                        >
                          <SelectTrigger className={selectClass}>
                            <SelectValue
                              placeholder={
                                isLoadingCountries
                                  ? "Loading…"
                                  : "Select country"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {countries.map((c) => (
                                <SelectItem key={c.code} value={c.code}>
                                  <span className="flex items-center gap-2">
                                    <img
                                      src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                                      alt={c.name}
                                      className="inline-block size-4"
                                    />
                                    {c.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    name="state"
                    control={form.control}
                    rules={{
                      // Only enforce when the country actually has regions to
                      // pick from — some countries return an empty list.
                      required:
                        regions.length > 0
                          ? "State / Region is required"
                          : false,
                    }}
                    render={({ field }) => (
                      <FormItem className="min-w-0">
                        <FormLabel className="text-white text-xs font-normal">
                          State / Region <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(val) => {
                              field.onChange(val);
                              form.setValue("city", "");
                            }}
                            disabled={!watchedCountry || isLoadingCities}
                          >
                            <SelectTrigger className={selectClass}>
                              <SelectValue
                                placeholder={
                                  isLoadingCities ? "Loading…" : "Select"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {regions.map((r) => (
                                  <SelectItem key={r.code} value={r.code}>
                                    {r.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="city"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="min-w-0">
                        <FormLabel className="text-white text-xs font-normal">
                          City <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!watchedState}
                          >
                            <SelectTrigger className={selectClass}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {availableCities.map((c) => (
                                  <SelectItem key={c.code} value={c.code}>
                                    {c.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  name="postalCode"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Postal Code <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter postal code"
                          className={inputClass}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6 flex gap-3 pb-6">
                <button
                  type="button"
                  onClick={() => setInnerStep(0)}
                  className={backBtn}
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                <button
                  type="submit"
                  className={`${primaryBtn} flex-1`}
                  style={{ backgroundColor: "#4A93DB" }}
                >
                  Continue
                  <ChevronRight size={16} />
                </button>
              </div>
            </Form>
          </form>
        </div>
      )}

      {/* ── STEP 3 — Employment ── */}
      {innerStep === 2 && (
        <div className="flex flex-1 flex-col">
          <form className="flex flex-1 flex-col" onSubmit={onContinue}>
            <Form {...form}>
              <div className="flex-1 space-y-4">
                <FormField
                  name="cardPurpose"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Card Purpose
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter purpose"
                          className={inputClass}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <h3 className="text-white text-base font-semibold">
                    Employment info
                  </h3>
                  <p className="text-dark-text-300 mb-3 text-xs">
                    Required by financial regulations
                  </p>
                  <FormField
                    name="employmentStatus"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-xs font-normal">
                          Employment Status{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              "Employed",
                              "Self-employed",
                              "Student",
                              "Unemployed",
                            ].map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => field.onChange(status)}
                                className="h-11 rounded-xl border text-sm font-medium transition-all duration-150"
                                style={
                                  field.value === status
                                    ? activeToggleStyle
                                    : inactiveToggleStyle
                                }
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  name="occupation"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Occupation <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter occupation"
                          className={inputClass}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="annualIncome"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Annual Income <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className={selectClass}>
                            <SelectValue placeholder="Select income range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {[
                                { label: "Under $20,000", value: "10000" },
                                { label: "$20,000 – $50,000", value: "35000" },
                                {
                                  label: "$50,000 – $100,000",
                                  value: "75000",
                                },
                                {
                                  label: "$100,000 – $250,000",
                                  value: "175000",
                                },
                                { label: "Over $250,000", value: "300000" },
                              ].map(({ label, value }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="expectedMonthlyVolume"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Expected Monthly Volume{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className={selectClass}>
                            <SelectValue placeholder="Select monthly volume" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {[
                                { label: "Under $1,000", value: "500" },
                                { label: "$1,000 – $5,000", value: "3000" },
                                { label: "$5,000 – $20,000", value: "12500" },
                                { label: "$20,000 – $50,000", value: "35000" },
                                { label: "Over $50,000", value: "75000" },
                              ].map(({ label, value }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6 flex gap-3 pb-6">
                <button
                  type="button"
                  onClick={() => setInnerStep(1)}
                  className={backBtn}
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                <button
                  type="submit"
                  className={`${primaryBtn} flex-1`}
                  style={{ backgroundColor: "#4A93DB" }}
                >
                  Continue
                  <ChevronRight size={16} />
                </button>
              </div>
            </Form>
          </form>
        </div>
      )}

      {/* ── STEP 4 — Identity ── */}
      {innerStep === 3 && (
        <div className="flex flex-1 flex-col">
          <div className="mb-4">
            <h3 className="text-white text-base font-semibold">
              Verify identity
            </h3>
            <p className="text-dark-text-300 text-xs">
              Required under KYC · reviewed within minutes
            </p>
          </div>

          <form className="flex flex-1 flex-col" onSubmit={onFinalSubmit}>
            <Form {...form}>
              <div className="flex-1 space-y-4">
                <FormField
                  name="documentType"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Document Type <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2">
                          {DOCUMENT_TYPES.map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => field.onChange(type)}
                              className="h-11 rounded-xl border text-sm font-medium transition-all duration-150"
                              style={
                                field.value === type
                                  ? activeToggleStyle
                                  : inactiveToggleStyle
                              }
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="documentNumber"
                  control={form.control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        {form.watch("documentType") || "Passport"} Number{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={`Enter ${form.watch("documentType") || "Passport"} number`}
                          className={inputClass}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3">
                  <FormField
                    name="issueDate"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-xs font-normal">
                          Issue Date <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="w-full overflow-hidden">
                            <input
                              type="date"
                              className={dateClass}
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="idExpiryDate"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-xs font-normal">
                          Expiry Date <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="w-full overflow-hidden">
                            <input
                              type="date"
                              className={dateClass}
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Hidden file inputs */}
                {(["Front ID", "Back ID", "Selfie"] as const).map((label) => (
                  <input
                    key={label}
                    ref={
                      deviceRefMap[label] as React.RefObject<HTMLInputElement>
                    }
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) =>
                      setFileMap[label](e.target.files?.[0] ?? null)
                    }
                  />
                ))}
                {(["Front ID", "Back ID", "Selfie"] as const).map((label) => (
                  <input
                    key={`cam-${label}`}
                    ref={
                      cameraRefMap[label] as React.RefObject<HTMLInputElement>
                    }
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) =>
                      setFileMap[label](e.target.files?.[0] ?? null)
                    }
                  />
                ))}

                <UploadButton
                  label="Front ID"
                  subtitle="Upload or take photo of the front."
                  file={frontIdFile}
                  onOpen={() => setActiveUpload("Front ID")}
                />
                <UploadButton
                  label="Back ID"
                  subtitle="Upload or take photo of the back."
                  file={backIdFile}
                  onOpen={() => setActiveUpload("Back ID")}
                />
                <UploadButton
                  label="Selfie"
                  subtitle="Upload or take a photo of yourself."
                  file={selfieFile}
                  onOpen={() => setActiveUpload("Selfie")}
                />
              </div>

              <div className="mt-6 pb-6">
                <p
                  className="mb-3 text-center text-xs"
                  style={{ color: "#FFAFAF" }}
                >
                  ⏳ Cardholder verification may take up to 24 hours to
                  complete.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setInnerStep(2)}
                    className={backBtn}
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || isCreating}
                    className={`${primaryBtn} flex-1 disabled:cursor-not-allowed`}
                    style={{
                      backgroundColor: "#4A93DB",
                      opacity: isUploading || isCreating ? 0.5 : 1,
                    }}
                  >
                    {isUploading ? (
                      <span className="flex items-center gap-2">
                        <Throbber /> Uploading…
                      </span>
                    ) : isCreating ? (
                      <Throbber />
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            </Form>
          </form>
        </div>
      )}

      {/* Upload modal */}
      <AnimatePresence mode="wait">
        {activeUpload && (
          <ModalBackdrop
            onClose={() => {
              stopCamera();
              setActiveUpload(null);
            }}
            className="z-50"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              variants={
                isMobile
                  ? {
                      initial: { y: "100vh", opacity: 0 },
                      animate: {
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.3, ease: "easeOut" },
                      },
                      exit: {
                        y: "100vh",
                        opacity: 0,
                        transition: { duration: 0.3, ease: "easeIn" },
                      },
                    }
                  : {
                      initial: { scale: 0.95, opacity: 0 },
                      animate: {
                        scale: 1,
                        opacity: 1,
                        transition: { duration: 0.2, ease: "easeOut" },
                      },
                      exit: {
                        scale: 0.95,
                        opacity: 0,
                        transition: { duration: 0.2, ease: "easeIn" },
                      },
                    }
              }
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed bottom-0 w-full max-w-full rounded-t-2xl bg-white px-4 py-6 shadow-xl md:static md:max-w-[400px] md:rounded-2xl"
            >
              {/* Drag handle (mobile) */}
              <div className="absolute top-2 right-1/2 block h-1 w-20 translate-x-1/2 rounded-full bg-[#E1E5EB] md:hidden" />

              <div className="relative">
                {/* Default options */}
                {!cameraActive && (
                  <>
                    <div className="mb-5 flex items-start justify-between">
                      <div>
                        <h3 className="text-dark-text-400 text-base font-semibold">
                          {activeUpload}
                        </h3>
                        <p className="text-dark-text-300 text-xs">
                          Choose how you&apos;d like to add your photo
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveUpload(null)}
                        className="text-dark-text-300 flex size-8 items-center justify-center rounded-full border border-[#E1E5EB] bg-[#FBFBFB] transition-all hover:cursor-pointer active:scale-90"
                      >
                        <X className="size-4" />
                      </button>
                    </div>

                    {/* Take photo */}
                    <button
                      type="button"
                      onClick={startCamera}
                      className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-dashed px-4 py-3.5 transition-opacity hover:opacity-90"
                      style={{ borderColor: "#62D1F3", background: "#F7FDFF" }}
                    >
                      <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-full border border-dashed bg-[#F0FBFF]"
                        style={{ borderColor: "#62D1F3" }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#62D1F3"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-dark-text-400 text-sm font-semibold">
                          Take photo
                        </p>
                        <p className="text-dark-text-300 text-xs">
                          Use your camera to capture now
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-dark-text-300" />
                    </button>

                    {/* Upload from device */}
                    <button
                      type="button"
                      onClick={() => {
                        const ref = deviceRefMap[activeUpload];
                        setActiveUpload(null);
                        setTimeout(() => ref?.current?.click(), 50);
                      }}
                      className="mb-5 flex w-full items-center gap-3 rounded-2xl border border-dashed px-4 py-3.5 transition-opacity hover:opacity-90"
                      style={{ borderColor: "#62D1F3", background: "#F7FDFF" }}
                    >
                      <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-full border border-dashed bg-[#F0FBFF]"
                        style={{ borderColor: "#62D1F3" }}
                      >
                        <Upload size={18} color="#62D1F3" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-dark-text-400 text-sm font-semibold">
                          Upload from device
                        </p>
                        <p className="text-dark-text-300 text-xs">
                          Choose a file from your device
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-dark-text-300" />
                    </button>

                    {/* Footer hint */}
                    <p className="text-dark-text-300 flex items-center justify-center gap-1.5 text-center text-xs">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      JPG, PNG, PDF · Max 10MB · All 4 corners visible · No
                      glare or blur
                    </p>
                  </>
                )}

                {/* Live camera view */}
                {cameraActive && !capturedImageUrl && (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-dark-text-400 text-base font-semibold">
                          Take Photo
                        </h3>
                        <p className="text-dark-text-300 text-xs">
                          Position your document clearly
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="text-dark-text-300 flex size-8 items-center justify-center rounded-full border border-[#E1E5EB] bg-[#FBFBFB] transition-all hover:cursor-pointer active:scale-90"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className="overflow-hidden rounded-xl bg-black">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full rounded-xl"
                      />
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="text-dark-text-400 flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-[#E1E5EB] bg-[#FBFBFB] py-3.5 text-sm font-semibold"
                      >
                        <ChevronLeft size={16} />
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white"
                        style={{ backgroundColor: "#4A93DB" }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                        Capture
                      </button>
                    </div>
                  </div>
                )}

                {/* Captured preview */}
                {cameraActive && capturedImageUrl && (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-dark-text-400 text-base font-semibold">
                          Review Photo
                        </h3>
                        <p className="text-dark-text-300 text-xs">
                          Make sure the photo is clear
                        </p>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-xl">
                      <img
                        src={capturedImageUrl}
                        alt="Captured"
                        className="w-full rounded-xl object-cover"
                      />
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setCapturedImageUrl(null);
                          startCamera();
                        }}
                        className="text-dark-text-400 flex flex-1 items-center justify-center rounded-2xl border border-[#E1E5EB] bg-[#FBFBFB] py-3.5 text-sm font-semibold"
                      >
                        Retake
                      </button>
                      <button
                        type="button"
                        onClick={proceedWithCapture}
                        className="flex flex-1 items-center justify-center rounded-2xl py-3.5 text-sm font-semibold text-white"
                        style={{ backgroundColor: "#4A93DB" }}
                      >
                        Use Photo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </ModalBackdrop>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateCardholder;

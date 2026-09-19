import Copy from "@/components/copy";
import { useUser } from "@/zustand/store";
const TwoFactor = () => {
  const { user } = useUser();
  return (
    <div className="text-white">
      <h3>Two-Factor Authentication</h3>
      <div
        className="mt-6 flex size-12 items-center justify-center rounded-full"
        style={{
          background:
            "linear-gradient(128.62deg, #E3F7FF 11.02%, #D3BBF1 93.11%)",
        }}
      >
        <img src="/icons/2fa-ice.svg" alt="" />
      </div>
      <h3 className="mt-4">Add to your authenticator app</h3>
      <div className="my-4 flex h-12 w-full items-center justify-center gap-4 rounded border border-[#6EF7FF2E] px-4 py-2 text-xs">
        <span>{user.authenticatorSecret}</span>
        <Copy icon="/icons/copy-light.svg" text={user.authenticatorSecret} />
      </div>
      <p className="text-[10px] ">
        Copy the token above and add it to you authenticator app, you’ll be
        required to use your authenticator code to complete your registration.
      </p>
    </div>
  );
};

export default TwoFactor;

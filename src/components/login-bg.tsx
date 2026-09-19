const LoginBg = () => {
  return (
    <div
      className="font-darker h-dvh w-screen px-4 pt-6 text-white "
      style={{
        background: "linear-gradient(180deg, #0B1828 0%, #05070E 100%)",
      }}
    >
      <h1 className="pr-12 text-[40px] leading-12 font-extrabold md:text-7xl">
        Virtual Cards for <span className="text-[#3FD8E8]">Every Payment.</span>
      </h1>
      <p className="mt-4 text-xl font-semibold md:text-3xl">
        Create and use virtual cards for shopping, subscriptions, and everyday
        online payments.
      </p>

      <img
        className="absolute top-2/4 left-1/2 -translate-x-1/2 right-0 z-10 w-4/5 min-w-80 -translate-y-1/3 md:w-[600px]"
        src="/images/login-atm.svg"
        alt="Atm cards"
      />

      <img
        src="/images/login-grid.svg"
        alt=""
        className="absolute top-[30%] right-8 z-20 w-8"
      />

      {/* <img
        src="/images/login-bg-line.svg"
        alt=""
        className="absolute inset-x-0 bottom-0 z-0 w-full"
      /> */}

      <img
        src="/images/auth-logo.svg"
        alt=""
        className="absolute bottom-4 left-0 z-0 w-4/5 max-w-sm"
      />
    </div>
  );
};

export default LoginBg;

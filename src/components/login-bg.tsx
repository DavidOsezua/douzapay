const LoginBg = () => {
  return (
    <div
      className="font-darker relative h-dvh w-screen overflow-hidden px-4 pt-6 text-white"
      style={{
        background: "linear-gradient(180deg, #000000 0%, #1D1D1D 100%)",
      }}
    >
      <h1 className="relative z-10 pr-6 text-[28px] leading-9 font-bold">
        Welcome to the KrypKard Global Payment Ecosystem
      </h1>
      <p className="relative z-10 mt-4 text-sm leading-relaxed text-white/70">
        Spend across countries and currencies with one flexible payment card
        built for a borderless lifestyle.
      </p>

      <img
        className="absolute top-2/4 left-1/2 -translate-x-1/2 right-0 z-10 w-4/5 min-w-80 -translate-y-1/3 md:w-[600px]"
        src="/images/login-atm.svg"
        alt="Atm cards"
      />

      <img
        src="/images/login-grid.svg"
        alt=""
        className="absolute top-[8%] right-8 z-20 w-8"
      />
      <img
        src="/images/login-grid.svg"
        alt=""
        className="absolute right-10 bottom-[14%] z-20 w-10"
      />

      <img
        src="/images/bg-logo.svg"
        alt=""
        className="pointer-events-none absolute -bottom-10 -left-16 z-0 w-52 opacity-[0.08]"
      />

      <img
        src="/images/auth-icons.svg"
        alt=""
        className="absolute bottom-24 left-1/2 z-10 w-40 -translate-x-1/2"
      />

      <img
        src="/images/bg-logo.svg"
        alt=""
        className="absolute bottom-4 left-4 z-0 w-10"
      />
    </div>
  );
};

export default LoginBg;

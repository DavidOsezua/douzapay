import { NavLink } from "react-router-dom";

const MobileNav = () => {
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "/icons/dashboard.svg",
      activeIcon: "/icons/dashboard-active.svg",
    },
    {
      title: "My Wallet",
      url: "/dashboard/wallet",
      icon: "/icons/wallet.svg",
      activeIcon: "/icons/wallet-active.svg",
    },
    {
      title: "Cards",
      url: "/dashboard/cards",
      icon: "/icons/card.svg",
      activeIcon: "/icons/card-active.svg",
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: "/icons/transactions.svg",
      activeIcon: "/icons/transactions-active.svg",
    },
    {
      title: "Partners",
      url: "/dashboard/partners",
      icon: "/icons/partners.svg",
      activeIcon: "/icons/partners-active.svg",
    },
    {
      title: "More",
      url: "/dashboard/account",
      icon: "/icons/more-horizontal.svg",
      activeIcon: "/icons/more-horizontal-active.svg",
    },
  ];

  return (
    <>
      <nav className="text-primary-500 bg-dark-card-3 fixed inset-x-0 bottom-0 z-15 flex w-full items-center justify-between px-4 py-4 font-bold backdrop-blur-sm md:hidden">
        {items
          .filter((item) => item.title !== "Report and Statements")
          .map((item) => (
            <NavLink
              end
              key={item.title}
              to={item.url}
              className={({ isActive }) =>
                `flex size-10 flex-col items-center justify-center gap-2 rounded-md ${
                  isActive ? "text-primary-100" : "text-[#BEC5CE]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive ? item.activeIcon : item.icon}
                    alt={item.title}
                    className="h-6 w-6"
                  />
                  <span className="text-[9px] font-light text-nowrap">
                    {item.title}
                  </span>
                </>
              )}
            </NavLink>
          ))}
      </nav>
    </>
  );
};

export default MobileNav;

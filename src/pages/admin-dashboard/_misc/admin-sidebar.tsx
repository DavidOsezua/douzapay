import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";

const items = [
  {
    title: "Dashboard",
    url: "/admin-dashboard",
    icon: "/icons/dashboard-neutral.svg",
    activeIcon: "/icons/dashboard-active-admin.svg",
  },
  {
    title: "User Management",
    url: "/admin-dashboard/users",
    icon: "/icons/users.svg",
    activeIcon: "/icons/wallet-active-admin.svg",
  },
  {
    title: "My Cards",
    url: "/admin-dashboard/cards",
    icon: "/icons/card-neutral.svg",
    activeIcon: "/icons/card-active-admin.svg",
  },
  {
    title: "Transactions",
    url: "/admin-dashboard/transactions",
    icon: "/icons/transaction.svg",
    activeIcon: "/icons/shop-active.svg",
  },
  {
    title: "Referral System",
    url: "/admin-dashboard/referrals",
    icon: "/icons/referral.svg",
    activeIcon: "/icons/referral-active.svg",
  },
  {
    title: "Settlements",
    url: "/admin-dashboard/settlements",
    icon: "/icons/referral.svg",
    activeIcon: "/icons/referral-active.svg",
  },
];

const AdminSidebar = () => {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar variant="floating">
      <div className="font-darker size-full overflow-hidden rounded-2xl bg-white">
        <SidebarHeader>
          <div>
            <div className="text-primary-500 flex items-center gap-2.5 px-4 pt-2">
              <img
                src="/images/duozapay-logo.svg"
                className="w-24"
                alt="Duozapay Logo"
              />
            </div>
            <p className="pl-4 text-xl uppercase">Admin Dashboard</p>
          </div>
        </SidebarHeader>

        <SidebarContent className={"text-primary-neutral mt-4"}>
          <SidebarMenu className={"pl-4"}>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <NavLink
                  end={item.url === "/admin-dashboard"}
                  to={item.url}
                  onClick={() => setOpenMobile(false)}
                >
                  {({ isActive }) => (
                    <SidebarMenuButton
                      className={`hover:bg-primary-500 hover:text-primary-100 relative h-auto rounded-r-none px-4 ${
                        isActive
                          ? "bg-primary-500 text-primary-100"
                          : "text-primary-neutral"
                      }`}
                      asChild
                    >
                      <div>
                        <img
                          src={isActive ? item.activeIcon : item.icon}
                          className="size-4"
                          alt={item.title}
                        />
                        <span className="mb-1 text-lg leading-6">
                          {item.title}
                        </span>
                        {isActive && (
                          <div className="bg-primary-100 absolute inset-y-0 right-0 w-1 rounded-l" />
                        )}
                      </div>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </div>
    </Sidebar>
  );
};

export default AdminSidebar;

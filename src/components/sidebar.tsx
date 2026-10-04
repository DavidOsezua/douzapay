import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import { NavLink } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronRight } from "lucide-react";

const items: {
  title: string;
  url: string;
  icon: string;
  activeIcon: string;
  submenu?: { title: string; url: string }[];
}[] = [
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
    title: "My Cards",
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

const AppSidebar = () => {
  return (
    <Sidebar variant="sidebar">
      <div className="bg-dark-background-main border-dark-stroke-5 flex size-full flex-col overflow-hidden border-r-[0.5px]">
        <SidebarHeader>
          <div className="text-primary-100 flex items-center justify-center px-4 py-2">
            <img src="/images/duozapay-logo-light.svg" alt="Duozapay logo" />
          </div>
        </SidebarHeader>

        <SidebarContent className={"text-white"}>
          <SidebarMenu className={"pl-4"}>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.submenu ? (
                  <Collapsible className="group/collapsible" defaultOpen>
                    <CollapsibleTrigger asChild>
                      <NavLink end={item.url === "/dashboard"} to={item.url}>
                        {({ isActive }) => (
                          <SidebarMenuButton
                            className={`hover:bg-primary-100/15 hover:text-primary-100 relative rounded-r-none px-4 py-5 ${
                              isActive ? "text-primary-100" : "text-primary-b"
                            }`}
                            asChild
                          >
                            <div>
                              <img
                                src={isActive ? item.activeIcon : item.icon}
                                className="size-4"
                                alt={item.title}
                              />
                              <span className="leading-6">{item.title}</span>

                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </div>
                          </SidebarMenuButton>
                        )}
                      </NavLink>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.submenu.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <NavLink
                              end={subItem.url === "/dashboard"}
                              to={subItem.url}
                            >
                              {({ isActive }) => (
                                <SidebarMenuButton
                                  className={`hover:bg-primary-100/15 hover:text-primary-100 relative px-4 py-5 ${
                                    isActive
                                      ? "text-primary-100 bg-dark-selected-1"
                                      : "text-primary-bg"
                                  }`}
                                  asChild
                                >
                                  <div>
                                    <img
                                      src={
                                        isActive ? item.activeIcon : item.icon
                                      }
                                      className="size-4"
                                      alt={subItem.title}
                                    />
                                    <span className="leading-6">
                                      {subItem.title}
                                    </span>
                                  </div>
                                </SidebarMenuButton>
                              )}
                            </NavLink>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <NavLink end={item.url === "/dashboard"} to={item.url}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        className={`hover:bg-primary-100/15 hover:text-[#E1E1E1] relative h-auto rounded-r-none px-4 ${
                          isActive
                            ? "text-[#E1E1E1] bg-dark-selected-1"
                            : "text-[#E3E8FF]"
                        }`}
                        asChild
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={isActive ? item.activeIcon : item.icon}
                            className="size-4"
                            alt={item.title}
                          />
                          <span className="leading-6">{item.title}</span>
                          {isActive && (
                            <div className="bg-[#E1E1E1] absolute inset-y-0 right-0 w-1 rounded-l" />
                          )}
                        </div>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="mb-4 text-white">
          <span className="mx-auto">
            <span className="block text-sm font-light">
              Email:{" "}
              <a
                // href="mailto:support@duozapay.com"
                className="text-primary-100 underline hover:no-underline"
              >
                support@duozapay.com
              </a>
            </span>
            <span className="block text-sm font-light">
              Telegram:{" "}
              <a
                // href="https://t.me/duozapaysupport"
                // target="_blank"
                // rel="noopener noreferrer"
                className="text-primary-100 underline hover:no-underline"
              >
                @duozapaysupport
              </a>
            </span>
          </span>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;

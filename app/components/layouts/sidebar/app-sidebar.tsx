import * as React from "react";
import {
  ChartNetwork,
  Frame,
  Framer,
  Home,
  Map,
  PieChart,
  Settings2,
  ShoppingCart,
  SquareTerminal,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";

const data = {
  user: {
    name: "Jeevan Jose",
    email: "m@example.com",
    avatar: "/",
  },
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Inventory",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Products",
          url: "/products",
        },
        {
          title: "Catogery",
          url: "#",
        },
      ],
    },

    {
      title: "Orders",
      url: "#",
      icon: ShoppingCart,
    },
    {
      title: "Analytics",
      url: "#",
      icon: ChartNetwork,
    },
    {
      title: "Customers",
      url: "#",
      icon: Users,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="hover:bg-transparent focus-visible:bg-transparent"
              size="lg"
              asChild
            >
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Framer />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-lg italic">
                    Lorenza
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}

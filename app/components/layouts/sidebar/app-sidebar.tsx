import * as React from "react";
import {
  ChartNetwork,
  Component,
  Home,
  ImagePlay,
  ShoppingCart,
  SquareTerminal,
  Users,
  Layers,
  History,
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
import { images } from "~/shared/images/image";
import { useGlobalCount } from "~/services/queries/product";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: count } = useGlobalCount();

  const data = {
    user: {
      name: "Jeevan Jose",
      email: "m@example.com",
      avatar: "/",
    },
    navMain: [
      {
        title: "Home",
        url: "/",
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
            title: "Categories",
            url: "/category",
          },
          {
            title: "Brands",
            url: "/brands",
          },
          {
            title: "Supplier",
            url: "/supplier",
          },
          {
            title: "Materials",
            url: "/materials",
          },
          {
            title: "Attributes",
            url: "/attributes",
          },
          {
            title: "Size Chart",
            url: "/size-charts",
          },
        ],
      },
      {
        title: "Media",
        url: "/media",
        icon: ImagePlay,
      },
      {
        title: "Orders",
        url: "#",
        isActive: true,
        icon: ShoppingCart,
        items: [
          {
            title: "Orders",
            url: "/orders/all",
            count: count?.data?.orderCount,
          },
          {
            title: "New Orders",
            url: "/add-order",
          },
        ],
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
      {
        title: "Stock",
        url: "/stock-management",
        icon: Layers,
        count: count?.data?.lowStockCount,
      },
      {
        title: "Transactions",
        url: "/transaction-history",
        icon: History,
      },
      {
        title: "Others",
        url: "#",
        icon: Component,
        items: [
          {
            title: "Slider",
            url: "/slider",
          },
          {
            title: "Admin Users",
            url: "/admin-users",
          },
          
        ],
      },
    ],
  };

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
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <img className="w-35" src={images.logo} alt="" />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}

import * as React from "react";
import {
  ChartNetwork,
  Component,
  Frame,
  Framer,
  Home,
  ImagePlay,
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
import { images } from "~/shared/images/image";

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
          title: "Catogeries",
          url: "/catogery",
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
      icon: ShoppingCart,
       items: [
        {
          title: "Orders",
          url: "/orders",
        },
        {
          title: "New Orders",
          url: "/new-orders",
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
      title: "Others",
      url: "#",
      icon: Component,
      items: [
        {
          title: "Slider",
          url: "/slider",
        },
      
      ],
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
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}

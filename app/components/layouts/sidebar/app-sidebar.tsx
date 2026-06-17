import * as React from "react";
import {
  ChartNetwork,
  Component,
  Home,
  ImagePlay,
  ShoppingCart,
  SquareTerminal,
  Layers,
  History,
  Proportions,
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
import { has_permission } from "~/lib/utils";
import { PERMISSIONS } from "~/shared/others/others";
import { useGetProfile } from "~/services/queries/auth";
import { Users } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: count } = useGlobalCount();
  const { data: profile } = useGetProfile();

  const current_permission = profile?.data?.user?.permission
    ? JSON.parse(profile?.data?.user?.permission)
    : [];

  const getFilteredNavItems = () => {
    const allNavItems = [
      {
        title: "Home",
        url: "/",
        icon: Home,
        permission: PERMISSIONS.HOME_VIEW,
      },
      {
        title: "Inventory",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        permission: PERMISSIONS.INVENTORY_VIEW,
        items: [
          {
            title: "Products",
            url: "/products",
            permission: PERMISSIONS.PRODUCTS_VIEW,
          },
          {
            title: "Categories",
            url: "/category",
            permission: PERMISSIONS.CATEGORIES_VIEW,
          },
          {
            title: "Brands",
            url: "/brands",
            permission: PERMISSIONS.BRANDS_VIEW,
          },
          {
            title: "Supplier",
            url: "/supplier",
            permission: PERMISSIONS.SUPPLIERS_VIEW,
          },
          {
            title: "Coupon",
            url: "/coupon",
            permission: PERMISSIONS.COUPONS_VIEW,
          },
          {
            title: "Materials",
            url: "/materials",
            permission: PERMISSIONS.MATERIALS_VIEW,
          },
          {
            title: "Attributes",
            url: "/attributes",
            permission: PERMISSIONS.ATTRIBUTES_VIEW,
          },
          {
            title: "Size Chart",
            url: "/size-charts",
            permission: PERMISSIONS.SIZE_CHARTS_VIEW,
          },
        ],
      },
      {
        title: "Media",
        url: "/media",
        icon: ImagePlay,
        permission: PERMISSIONS.MEDIA_VIEW,
      },
      {
        title: "Orders",
        url: "#",
        isActive: true,
        icon: ShoppingCart,
        permission: PERMISSIONS.ORDER_MENU,
        items: [
          {
            title: "Orders",
            url: "/orders/all",
            count: count?.data?.orderCount,
            permission: PERMISSIONS.ORDERS_VIEW,
          },
          {
            title: "New Orders",
            url: "/add-order",
            permission: PERMISSIONS.ORDERS_CREATE,
          },
        ],
      },
      {
        title: "Customers",
        url: "/customers",
        icon: Users,
        permission: PERMISSIONS.TRANSACTIONS_VIEW,
      },
      {
        title: "Stock",
        url: "/stock-management",
        icon: Layers,
        count: count?.data?.lowStockCount,
        permission: PERMISSIONS.STOCK_VIEW,
      },
      {
        title: "Transactions",
        url: "/transaction-history",
        icon: History,
        permission: PERMISSIONS.TRANSACTIONS_VIEW,
      },

      {
        title: "Reports",
        url: "#",
        icon: Proportions,
        isActive: true,
        permission: PERMISSIONS.TRANSACTIONS_VIEW,
        items: [
          {
            title: "Order Report",
            url: "/order-report",
            permission: PERMISSIONS.ORDERS_VIEW,
          },
          {
            title: "Top Selling Report",
            url: "/top-selling-report",
            permission: PERMISSIONS.ORDERS_CREATE,
          },
          {
            title: "Pre Order Report",
            url: "/pre-order-report",
            permission: PERMISSIONS.ORDERS_CREATE,
          },
        ],
      },
      {
        title: "Others",
        url: "#",
        icon: Component,
        permission: null,
        isActive: true,
        items: [
          {
            title: "Slider",
            url: "/slider",
            permission: PERMISSIONS.SLIDER_VIEW,
          },
          {
            title: "Admin Users",
            url: "/admin-users",
            permission: PERMISSIONS.ADMIN_USERS_VIEW,
          },
        ],
      },
    ];

    const filteredItems = allNavItems
      .map((item) => {
        if (item.items) {
          const allowedSubItems = item.items.filter((subItem) =>
            has_permission(subItem.permission, current_permission)
          );
          if (allowedSubItems.length > 0) {
            return {
              ...item,
              items: allowedSubItems,
            };
          }
          return null;
        }
        if (
          item.permission &&
          has_permission(item.permission, current_permission)
        ) {
          return item;
        }
        if (!item.permission) {
          return item;
        }

        return null;
      })
      .filter(Boolean);
    return filteredItems;
  };

  const data = {
    user: {
      name: "Jeevan Jose",
      email: "m@example.com",
      avatar: "/",
    },
    navMain: getFilteredNavItems(),
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
        <NavMain items={data.navMain as any} />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}

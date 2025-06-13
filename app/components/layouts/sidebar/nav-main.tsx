"use client"
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Badge } from "~/components/ui/badge";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    count?: number;
    items?: {
      title: string;
      url: string;
      count?: number;
    }[];
  }[];
}) {
  const location = useLocation();

  const is_active = (url: string) => {
    const item_url = url?.replaceAll("/", "");
    const path_array = location.pathname
      .split("/")
      ?.filter((item) => item !== "");
    if (Boolean(path_array.length)) {
      return path_array?.includes(item_url);
    } else if (item_url == "") {
      return true;
    }
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger className="cursor-pointer" asChild>
                    <SidebarMenuButton
                      isActive={is_active(item.url)}
                      size={"sm"}
                      className="data-[state=open]:[&>button]:rotate-90"
                    >
                      <>
                        <item.icon />
                        <span>{item.title}</span>
                        <SidebarMenuAction className="transition-transform data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            isActive={is_active(subItem.url)}
                            size={"sm"}
                            asChild
                          >
                            <Link
                              to={subItem.url}
                              className="flex w-full justify-between"
                            >
                              <span>{subItem.title}</span>
                              {subItem.count && subItem?.count > 0 && (
                                <Badge
                                  className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums bg-white"
                                  variant="outline"
                                >
                                  {subItem.count > 100 ? "100+" : subItem.count}
                                </Badge>
                              )}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <SidebarMenuButton
                  isActive={is_active(item.url)}
                  size={"sm"}
                  asChild
                  tooltip={item.title}
                >
                  <Link to={item.url} className="flex w-full justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon size={16} />
                      <span>{item.title}</span>
                    </div>
                    {item.count && item?.count > 0  && (
                      <Badge
                        className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums bg-white"
                        variant="outline"
                      >
                        {item.count > 100 ? "100+" : item?.count}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

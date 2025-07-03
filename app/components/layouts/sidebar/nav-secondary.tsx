import * as React from "react";
import { Settings2 } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import Settings from "~/components/common/settings";

export function NavSecondary({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <Settings>
            <SidebarMenuItem>
              <SidebarMenuButton size="sm">
                <Settings2 />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Settings>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

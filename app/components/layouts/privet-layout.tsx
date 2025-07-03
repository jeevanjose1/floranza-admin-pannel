import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import { AppSidebar } from "./sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,

} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { Bell, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { capitalize_first_letters, clearPermissionCache, is_auth, transform_name } from "~/lib/utils";
import { useGetProfile, useLogout } from "~/services/queries/auth";
import { useQueryClient } from "@tanstack/react-query";

type Props = {};

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
};

const pageTransition = {
  type: "keyframes",
  duration: 0.3,
};

const AnimatedOutlet = () => {
  const location = useLocation();
  const params = useParams();
  const shouldAnimate = () => {
    return params?.order_menu ? false : true;
  };

  if (!shouldAnimate()) {
    return (
      <div className="w-full h-full">
        <Outlet />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full h-full"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
};

export default function PrivateLayout({ }: Props) {
  const is_authenticated = is_auth();
  const query = useQueryClient()
  const { mutateAsync: logout } = useLogout();
  const navigate = useNavigate();
  const { data: profile } = useGetProfile();
  const profile_date = profile?.data?.user
  if (!is_authenticated) {
    return <Navigate to={"/login"} />;
  }

  const handleLogout = () => {
    logout().then(() => {
      query.clear()
      localStorage.clear();
      clearPermissionCache()
      navigate("/login");
    });
  };
  
  const current_page = location.pathname?.split('/')?.[1]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-bg-gray-two">
        <header className="flex h-14 border justify-between px-4 w-full border-muted shrink-0 bg-bg-gray-one rounded-xl items-center gap-2">
          <div className="flex items-center gap-2 ">
            <SidebarTrigger className="tablet:hidden inline-block" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">{capitalize_first_letters(current_page)?.replace('-', ' ')}</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-3">
            <Button variant={"ghost"} size={"icon"}>
              <Bell />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer" asChild>
                <Avatar className="rounded-sm">
                  <AvatarImage src={"/"} alt={"user"} />
                  <AvatarFallback className="rounded-md text-sm">
                    {profile_date?.name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="rounded-sm">
                      <AvatarImage src={"/"} alt={"user"} />
                      <AvatarFallback className="rounded-md text-sm">
                        {profile_date?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{profile_date?.name}</span>
                      <span className="truncate text-xs">
                        {profile_date?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="p-4 w-full ">
          <AnimatedOutlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

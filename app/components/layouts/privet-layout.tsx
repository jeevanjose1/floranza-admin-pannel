import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from '../ui/sidebar'
import { AppSidebar } from './sidebar/app-sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb'
import { Button } from '../ui/button'
import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import { ScrollArea } from '../ui/scroll-area'
import { is_auth } from '~/lib/utils'
import { useLogout } from '~/services/queries/auth'

type Props = {}

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },

}

const pageTransition = {
  type: 'tween',
  ease: [0.25, 0.1, 0.25, 1], 
  duration: 0.3,
}

const AnimatedOutlet = () => {
  const location = useLocation();
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


export default function PrivateLayout({}: Props) {
  const is_authenticated = is_auth()
  const {mutateAsync:logout} = useLogout()
  const navigate = useNavigate()
  if(!is_authenticated){
    return <Navigate to={'/login'}/>
  }

  const handleLogout = ()=>{
    logout().then(()=>{
 localStorage.clear()
    navigate('/')
    })
   
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='bg-bg-gray-two' >
        <header className="flex h-14 border justify-between px-4 w-full border-muted shrink-0 bg-bg-gray-one rounded-xl items-center gap-2">
          <div className="flex items-center gap-2 ">
            <SidebarTrigger className="tablet:hidden inline-block" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Products
                  </BreadcrumbLink>
                </BreadcrumbItem>               
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className='flex items-center gap-3'>
            <Button variant={'ghost'} size={'icon'}>
              <Bell/>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className='cursor-pointer' asChild>
                <Avatar className="rounded-sm">
                  <AvatarImage src={'/'} alt={'user'} />
                  <AvatarFallback className="rounded-md text-sm">CN</AvatarFallback>
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
                      <AvatarImage src={'/'} alt={'user'} />
                      <AvatarFallback className="rounded-md text-sm">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">jeevan jose</span>
                      <span className="truncate text-xs">jeevanjose@gmail.com</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                </DropdownMenuGroup>
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
  )
}
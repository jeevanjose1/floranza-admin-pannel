import { motion } from "framer-motion";
import { Link, Navigate, Outlet, useParams } from "react-router";
import PageHeader from "../common/page-header";
import BgWrapper from "../common/bg-wrapper";
import { useOrderMenuList } from "~/services/queries/order";
import { transform_name } from "~/lib/utils";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type Props = {};

export default function OrderLayout({}: Props) {
  const { data: menu_list } = useOrderMenuList({ page: 1 });
  const params = useParams();
  const menus = menu_list?.data || [];

  const tab_active = (menu: string) => {
    return params?.order_menu === menu;
  };

  const is_page = menus?.find(
    (item: any) => transform_name(item?.name) === params?.order_menu
  );

  if (menu_list && is_page === undefined) return <Navigate to={"/"} />;

  return (
    <div>
      <PageHeader title="Orders"/>

      <BgWrapper>
        <div className="relative  ">
          <ScrollArea className="max-w-[calc(100vw-260px)]">
            <div className="flex space-x-5 border-b border-gray-200">
              {menus.map((item: any, index: number) => {
                const path = transform_name(item?.name);
                return (
                  <Link
                    to={`/orders/${path}`}
                    key={item?.id || index}
                    className={`relative flex whitespace-nowrap items-center gap-2 py-3 last:pr-4 first:pl-4 text-[13px] font-medium transition-colors duration-200 ${
                      tab_active(path)
                        ? "text-muted-foreground"
                        : "text-muted-foreground/65 hover:text-muted-foreground/90"
                    }`}
                  >
                    <span dangerouslySetInnerHTML={{ __html: item?.icon }} />
                    {item?.name} ({item?.count})
                    {tab_active(path) && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted-foreground"
                        layoutId="activeTab"
                        initial={false}
                        transition={{
                          type: "keyframes",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div>
          <Outlet />
        </div>
      </BgWrapper>
    </div>
  );
}

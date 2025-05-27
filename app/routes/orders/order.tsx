import { Link, useParams } from "react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { Button } from "~/components/ui/button";
import OrderTableHeader from "../../components/screens/orders/order-table-header";
import { useOrderList, useOrderMenuList } from "~/services/queries/order";
import { FolderDot, User } from "lucide-react";
import { OrderTable } from "~/components/screens/orders/order-table";
import { transform_name } from "~/lib/utils";

type Props = {};

export default function Slider({}: Props) {
  const { data: menu_list } = useOrderMenuList({ page: 1 });
  const params = useParams();
  const menu_id = () => {
    const curr_menu = params?.order_menu;
    return menu_list?.data?.find(
      (item: any) => transform_name(item?.name) === curr_menu
    )?.status;
  };
  const {
    data: order_list,
    isLoading,
    isFetching,
  } = useOrderList({ page: 1, type: menu_id() });

  const filtred_order =
    order_list?.data?.data?.map((item: any) => {
      return {
        id: item?.id,
        name: item?.fname,
        order_no: item?.order_no,
        status: item?.order_status,
        total: item?.price,
        order_via: item?.order_via,
        paid_status: item?.paid_status,
        date: item?.date,
        pre_order_date:item?.pre_order_date
      };
    }) || [];

  return (
    
    <OrderTable table_data={filtred_order} loading={isLoading || isFetching} />
  );
}

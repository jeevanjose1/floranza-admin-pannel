import { useParams } from "react-router";

import { useOrderList, useOrderMenuList } from "~/services/queries/order";
import { OrderTable } from "~/components/screens/orders/order-table";
import { transform_name } from "~/lib/utils";
import OrderTableHeader from "~/components/screens/orders/order-table-header";
import { useState } from "react";

type Props = {};

export default function Slider({}: Props) {
  const { data: menu_list } = useOrderMenuList({ page: 1 });
 
  const [selected,setSelected] = useState({})
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

const selected_filtred = () => {
  return Object.keys(selected)
    .map(index => filtred_order?.[parseInt(index)]?.id)
    .filter(Boolean) // Remove undefined values
}



  return (
    <>
    <OrderTableHeader selected={selected_filtred()} setSelected={setSelected}/>
    <OrderTable selected={selected} setSelected={setSelected} table_data={filtred_order} loading={isLoading || isFetching} />
    </>
  );
}

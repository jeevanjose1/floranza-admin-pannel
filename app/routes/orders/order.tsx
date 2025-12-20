import { useParams } from "react-router";

import { useOrderList, useOrderMenuList } from "~/services/queries/order";
import { OrderTable } from "~/components/screens/orders/order-table";
import { permission_loader, transform_name } from "~/lib/utils";
import OrderTableHeader from "~/components/screens/orders/order-table-header";
import { useState } from "react";
import useQueryParams from "~/hooks/use-query-param";

export const clientLoader = () => permission_loader('orders:view')


export default function Order() {
  const { data: menu_list } = useOrderMenuList({ page: 1 });
  const { getAllParams } = useQueryParams();
  const query_params = getAllParams();
  const [selected, setSelected] = useState({});
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
  } = useOrderList({
    type: menu_id(),
    page: query_params.page,
    keyword: query_params.search,
    start_date: query_params?.from,
    end_date: query_params?.to,
    courier: query_params?.courier,
    is_pre_order: query_params?.is_pre_order,
    pre_order_date: query_params?.pre_order_date
  });



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
        pre_order_date: item?.pre_order_date,
        track_id: item?.track_id ? item?.track_id : "-",
        courier: item?.courier,
        is_reserved: params.order_menu === "reserved",
        is_all: params.order_menu === "all",
        reserved_order: Boolean(item?.reserved_order),
        is_preorder: Boolean(item?.is_pre_order)
      };
    }) || [];

  const selected_filtred = () => {
    return Object.keys(selected)
      .map((index) => filtred_order?.[parseInt(index)]?.id)
      .filter(Boolean); // Remove undefined values
  };

  return (
    <>
      <OrderTableHeader
        selected={selected_filtred()}
        setSelected={setSelected}
      />
      <OrderTable
        is_next={order_list?.data?.next_page_url}
        current_page={order_list?.data?.current_page}
        is_previous={order_list?.data?.prev_page_url}
        total_page={Math.ceil(order_list?.data?.total / order_list?.data?.per_page)}
        selected={selected}
        setSelected={setSelected}
        table_data={filtred_order}
        loading={isLoading || isFetching}
      />
    </>
  );
}

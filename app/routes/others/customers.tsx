import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import PermissionWrapper from "~/components/common/permission-wrapper";

import { CustomerTable } from "~/components/screens/customers/customer-table";
import CustomerTableHeader from "~/components/screens/customers/customer-table-header";
import { Button } from "~/components/ui/button";
import useQueryParams from "~/hooks/use-query-param";
import { permission_loader } from "~/lib/utils";
import { useListCustomer } from "~/services/queries";

export const clientLoader = () => permission_loader('categories:view')

export default function Customer() {
  const { getAllParams } = useQueryParams();
  const query_params = getAllParams();

  const {
    data: customer_data,
    isLoading,
    isFetching,
  } = useListCustomer({
    page: query_params.page,
    keyword: query_params.search,
    start_date: query_params.start_date,
    end_date: query_params.end_date,
  });

  const filterd_customer =
    customer_data?.data?.data?.map((item: any) => {
      return {
        id: item?.user_id,
        name: item?.name,
        username: item?.username,
        phone: item?.phone,
        email: item?.email,
        country: item?.country,
        address: `${item?.address_1 || ""} ${item?.address_2 || ""}`.trim(),
        city: item?.city,
        state: item?.state,
        postcode: item?.postcode,
        order_count: item?.order_count,
        created_date: item?.created_date_normal_format || item?.created_date,
      };
    }) || [];
  return (
    <div>
      <PageHeader title="Customers">

      </PageHeader>
      <BgWrapper>
        <CustomerTableHeader />
        <CustomerTable
          is_next={customer_data?.data?.next_page_url}
          current_page={customer_data?.data?.current_page}
          is_previous={customer_data?.data?.prev_page_url}
          loading={isFetching || isLoading}
          table_data={filterd_customer}
          total_page={Math.ceil(customer_data?.data?.total / customer_data?.data?.per_page)}
        />
      </BgWrapper>
    </div>
  );
}

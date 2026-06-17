import { useParams } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import CustomerOrderReportTableHeader from "~/components/screens/customers/customer-order-report-table-header";
import { CustomerOrderReportTable } from "~/components/screens/customers/customer-order-report-table";
import useQueryParams from "~/hooks/use-query-param";
import { permission_loader } from "~/lib/utils";
import { useCustomerOrderList } from "~/services/queries/customers";

export const clientLoader = () => permission_loader("transactions:view");

export default function CustomerOrderReport() {
  const { customer_id } = useParams();
  const { getAllParams } = useQueryParams();
  const query_params = getAllParams();

  const {
    data: report_list,
    isFetching,
    isLoading,
  } = useCustomerOrderList({
    id: customer_id,
    page: query_params.page,
    keyword: query_params.search,
    start_date: query_params?.from,
    end_date: query_params?.to,
    type: query_params?.type,
  });

  const tableData = report_list?.data?.data || [];
  const pagination = report_list?.data || {};
  const orderSummary = report_list?.data?.order || {};
  const customerInfo = report_list?.data?.customer || null;

  return (
    <div>
      <PageHeader title="Customer Order Report" />
      <BgWrapper>
        <CustomerOrderReportTableHeader />
        <CustomerOrderReportTable
          table_data={tableData}
          loading={isLoading || isFetching}
          is_next={pagination?.next_page_url || false}
          is_previous={pagination?.prev_page_url || false}
          current_page={pagination?.current_page || 1}
          total_page={Math.ceil((pagination?.total || 0) / (pagination?.per_page || 1))}
          summary={{
            total_sales: orderSummary?.total_sales,
            order_count: orderSummary?.order_count,
            pre_order_count: orderSummary?.pre_order_count,
          }}
          customer={customerInfo}
        />
      </BgWrapper>
    </div>
  );
}

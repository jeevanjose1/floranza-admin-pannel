import { useLocation } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import ReportTableHeader from "~/components/screens/reports/report-table-header";
import { OrderReportTable } from "~/components/screens/reports/order-report-table";
import { TopSellingReportTable } from "~/components/screens/reports/top-selling-report-table";
import { PreOrderReportTable } from "~/components/screens/reports/pre-order-report-table";
import useQueryParams from "~/hooks/use-query-param";
import { permission_loader } from "~/lib/utils";
import { useListReport } from "~/services/queries/report";

export const clientLoader = () => permission_loader("transactions:view");

export default function Reports() {
  const { getAllParams } = useQueryParams();
  const location = useLocation();
  const pathname = location.pathname.split("/")[1];

  const getType = () => {
    switch (pathname) {
      case "order-report":
        return "order";
      case "top-selling-report":
        return "top_selling";
      case "pre-order-report":
        return "pre_order";
      default:
        return "order";
    }
  };

  const getPageTitle = () => {
    switch (pathname) {
      case "order-report":
        return "Order Report";
      case "top-selling-report":
        return "Top Selling Products Report";
      case "pre-order-report":
        return "Pre-Order Report";
      default:
        return "Report";
    }
  };

  const query_params = getAllParams();
  const {
    data: report_list,
    isFetching,
    isLoading,
  } = useListReport({
    filter: {
      page: query_params.page,
      keyword: query_params.search,
      start_date: query_params?.from,
      end_date: query_params?.to,
    },
    type: getType(),
  });

  const reportType = getType();
  const tableData = report_list?.data?.data || [];
  const pagination = report_list?.data || {};
  const summary = report_list?.data || {};
  const orderSummary = report_list?.data?.order || {};
  console.log("tableData", pagination);

  return (
    <div>
      <PageHeader title={getPageTitle()} />
      <BgWrapper>
        <ReportTableHeader />

        {reportType === "order" && (
          <OrderReportTable
            table_data={tableData}
            loading={isLoading || isFetching}
            is_next={pagination?.next_page_url || false}
            is_previous={pagination?.prev_page_url || false}
            current_page={pagination?.current_page || 1}
            total_page={Math.ceil(pagination?.total / pagination?.per_page)}
            summary={{
              total_sales: orderSummary?.total_sales,
              order_count: orderSummary?.order_count,
              pre_order_count: orderSummary?.pre_order_count,
            }}
          />
        )}

        {reportType === "top_selling" && (
          <TopSellingReportTable
            table_data={tableData}
            loading={isLoading || isFetching}
            is_next={pagination?.next_page_url || false}
            is_previous={pagination?.prev_page_url || false}
            current_page={pagination?.current_page || 1}
            total_page={Math.ceil(pagination?.total / pagination?.per_page)}
            summary={{
              total_sale: summary?.total_sale,
              total_orders: summary?.total_orders,
            }}
          />
        )}

        {reportType === "pre_order" && (
          <PreOrderReportTable
            table_data={tableData}
            loading={isLoading || isFetching}
            is_next={pagination?.next_page_url || false}
            is_previous={pagination?.prev_page_url || false}
            current_page={pagination?.current_page || 1}
            total_page={Math.ceil(pagination?.total / pagination?.per_page)}
            summary={{
              total_sale: summary?.total_sale,
              total_orders: summary?.total_orders,
            }}
          />
        )}
      </BgWrapper>
    </div>
  );
}

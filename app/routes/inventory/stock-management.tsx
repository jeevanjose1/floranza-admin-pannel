import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { StockTable } from "~/components/screens/stock-management/stock-table";
import useQueryParams from "~/hooks/use-query-param";
import { permission_loader } from "~/lib/utils";
import { useLowQtyProduct } from "~/services/queries/product";
export const clientLoader = () => permission_loader('stock:view')


export default function StockManagement() {
  const { getAllParams } = useQueryParams();
  const query_params = getAllParams();
  const { data: list_product, isFetching, isLoading } = useLowQtyProduct({ page: query_params.page, });
  const filtred_list =
    list_product?.data?.data?.map((item: any) => {
      return {
        id: item?.id,
        sku: item?.sku,
        stock: item?.qty,
        attribute: item?.attribute_option_name
          ? item?.attribute_option_name
          : "-",
        preorder_at: Boolean(item?.is_pre_order) ? item?.pre_end_at : "-",
        status: item?.status === 1 ? "Active" : "Inactive",
        image: item?.images?.[0]?.large,
        name: item?.name,
        variation_id: item?.variation_id,
      };
    }) || [];

  return (
    <div>
      <PageHeader title="Stock Management" />
      <BgWrapper>
        {/* <StockTableHeader /> */}
        <StockTable
          is_next={list_product?.data?.next_page_url}
          current_page={list_product?.data?.current_page}
          is_previous={list_product?.data?.prev_page_url}
          table_data={filtred_list}
          loading={isFetching || isLoading}
          total_page={Math.ceil(list_product?.data?.total / list_product?.data?.per_page)}

        />
      </BgWrapper>
    </div>
  );
}

import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { StockTable } from "~/components/screens/stock-management/stock-table";
import StockTableHeader from "~/components/screens/stock-management/stock-table-header";
import { useLowQtyProduct } from "~/services/queries/product";

type Props = {};

export default function StockManagement({}: Props) {
  const { data: list_product, isFetching, isLoading } = useLowQtyProduct({});
  const filtred_list =
    list_product?.data?.map((item: any) => {
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
        />
      </BgWrapper>
    </div>
  );
}

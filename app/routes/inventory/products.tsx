
import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import PermissionWrapper from "~/components/common/permission-wrapper";
import {
  ProductTable,
  type Product,
} from "~/components/screens/products/product-table";
import ProductTableHeader from "~/components/screens/products/product-table-header";
import { Button } from "~/components/ui/button";
import useQueryParams from "~/hooks/use-query-param";
import { permission_loader } from "~/lib/utils";
import { useListProduct } from "~/services/queries";

export const clientLoader = ()=> permission_loader('products:view')

export default function Products() {
  const { getAllParams } = useQueryParams();
  const query_params = getAllParams();

  const {
    data: product_data,
    isLoading,
    isFetching,
  } = useListProduct({
    page: query_params.page,
    keyword: query_params.search,
    status: query_params.status,
    category: query_params.catogery,
    date: query_params.date
  });

  const filter_product: Product[] =
    product_data?.data?.data?.map((item: any) => {
      return {
        id: item.id,
        name: item?.name,
        sku: item?.sku,
        catogery: item?.product_categories,
        brand: item?.hsn,
        price: item?.reg_price,
        status: item?.status === 1 ? "Active" : "Inactive",
        date: item?.publishedAt,
        stock: item?.qty,
        image: item?.images?.[0]?.large,
        variations: item?.variations,
        scheduled: item?.is_scheduled,
        sheduled_at: item?.scheduled_at,
        prebook: item?.is_pre_order,
        preorder_at: item?.pre_end_at,
      };
    }) || [];

  return (
    <div>
      <PageHeader title="Products">
        <PermissionWrapper permission={'products:create'}>
          <div className="flex items-center gap-2 ">
            <Link to={"/products/new"}>
              <Button variant={"secondary"} size={"sm"}>
                Add Product
              </Button>
            </Link>
          </div>
        </PermissionWrapper>

      </PageHeader>
      <BgWrapper>
        <ProductTableHeader />
        <ProductTable
          current_page={product_data?.data?.current_page}
          table_data={filter_product}
          loading={isFetching || isLoading}
          is_next={product_data?.data?.next_page_url}
          is_previous={product_data?.data?.prev_page_url}
        />
      </BgWrapper>
    </div>
  );
}

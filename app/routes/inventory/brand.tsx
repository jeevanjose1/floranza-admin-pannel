import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import PermissionWrapper from "~/components/common/permission-wrapper";
import { BrandTable } from "~/components/screens/brands/brand-table";
import BrandTableHeader from "~/components/screens/brands/brand-table-header";
import { Button } from "~/components/ui/button";
import useQueryParams from "~/hooks/use-query-param";
import { permission_loader } from "~/lib/utils";
import { useListBrand } from "~/services/queries";

export const clientLoader = () => permission_loader('brands:view')


export default function Brand() {
  const { getAllParams } = useQueryParams();
  const query_params = getAllParams();
  const {
    data: brand_data,
    isLoading,
    isFetching,
  } = useListBrand({
    page: query_params.page,
    keyword: query_params.search,
    status: query_params.status,
    date: query_params.date,
  });

  const filtred_brand =
    brand_data?.data?.data?.map((item: any) => {
      return {
        id: item?.id,
        name: item?.name,
        description: item?.description,
        status: item?.status === 1 ? "Active" : "Inactive",
        image: item?.image?.mini,
        slug: item?.slug,
        count: item?.product_count,
      };
    }) || [];
  return (
    <div>
      <PageHeader title="Brand">
        <PermissionWrapper permission="brands:create">
          <div className="flex items-center gap-2 ">
            <Link to={"/brands/new"}>
              <Button variant={"secondary"} size={"sm"}>
                Add Brand
              </Button>
            </Link>
          </div>
        </PermissionWrapper>

      </PageHeader>
      <BgWrapper>
        <BrandTableHeader />
        <BrandTable
          is_next={brand_data?.data?.next_page_url}
          current_page={brand_data?.data?.current_page}
          is_previous={brand_data?.data?.prev_page_url}
          table_data={filtred_brand}
          loading={isFetching || isLoading}
          total_page={Math.ceil(brand_data?.data?.total / brand_data?.data?.per_page)}

        />
      </BgWrapper>
    </div>
  );
}

import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { BrandTable } from "~/components/screens/brands/brand-table";
import BrandTableHeader from "~/components/screens/brands/brand-table-header";
import { Button } from "~/components/ui/button";
import useQueryParams from "~/hooks/use-query-param";
import { useListBrand } from "~/services/queries";

type Props = {};

export default function Brand({}: Props) {
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
        count: 45,
      };
    }) || [];
  return (
    <div>
      <PageHeader title="Brand">
        <div className="flex items-center gap-2 ">
          <Link to={"/brands/new"}>
            <Button variant={"secondary"} size={"sm"}>
              Add Brand
            </Button>
          </Link>
        </div>
      </PageHeader>
      <BgWrapper>
        <BrandTableHeader />
        <BrandTable
          is_next={brand_data?.data?.next_page_url}
          current_page={brand_data?.data?.current_page}
          is_previous={brand_data?.data?.prev_page_url}
          table_data={filtred_brand}
          loading={isFetching || isLoading}
        />
      </BgWrapper>
    </div>
  );
}

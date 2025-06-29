import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { CatogeryTable } from "~/components/screens/catogery/catogery-table";
import CatogeryTableHeader from "~/components/screens/catogery/catogery-table-header";
import { Button } from "~/components/ui/button";
import useQueryParams from "~/hooks/use-query-param";
import { useListCatogery } from "~/services/queries";

type Props = {};

export default function Catogery({}: Props) {
  const { getAllParams } = useQueryParams();
  const query_params = getAllParams();

  const {
    data: catogery_data,
    isLoading,
    isFetching,
  } = useListCatogery({
    page: query_params.page,
    keyword: query_params.search,
    status: query_params.status,
    date: query_params.date,
  });

  const filterd_catogery =
    catogery_data?.data?.data?.map((item: any) => {
      return {
        id: item?.id,
        name: item?.name,
        description: item?.description,
        status: item?.status,
        slug: item?.slug,
        image: item?.image.mini,
        count: item?.product_count,
      };
    }) || [];
  return (
    <div>
      <PageHeader title="Category">
        <div className="flex items-center gap-2 ">
          <Link to={"/category/new"}>
            <Button variant={"secondary"} size={"sm"}>
              Add Category
            </Button>
          </Link>
        </div>
      </PageHeader>
      <BgWrapper>
        <CatogeryTableHeader />
        <CatogeryTable
          is_next={catogery_data?.data?.next_page_url}
          current_page={catogery_data?.data?.current_page}
          is_previous={catogery_data?.data?.prev_page_url}
          loading={isFetching || isLoading}
          table_data={filterd_catogery}
        />
      </BgWrapper>
    </div>
  );
}

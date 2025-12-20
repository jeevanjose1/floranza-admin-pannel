import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import PermissionWrapper from "~/components/common/permission-wrapper";
import { CatogeryTable } from "~/components/screens/catogery/catogery-table";
import CatogeryTableHeader from "~/components/screens/catogery/catogery-table-header";
import { Button } from "~/components/ui/button";
import useQueryParams from "~/hooks/use-query-param";
import { permission_loader } from "~/lib/utils";
import { useListCatogery } from "~/services/queries";

export const clientLoader = ()=> permission_loader('categories:view')

export default function Catogery() {
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
        <PermissionWrapper permission={'categories:create'}>

      
        <div className="flex items-center gap-2 ">
          <Link to={"/category/new"}>
            <Button variant={"secondary"} size={"sm"}>
              Add Category
            </Button>
          </Link>
        </div>
          </PermissionWrapper>
      </PageHeader>
      <BgWrapper>
        <CatogeryTableHeader />
        <CatogeryTable
          is_next={catogery_data?.data?.next_page_url}
          current_page={catogery_data?.data?.current_page}
          is_previous={catogery_data?.data?.prev_page_url}
          loading={isFetching || isLoading}
          table_data={filterd_catogery}
          total_page={Math.ceil(catogery_data?.data?.total / catogery_data?.data?.per_page)}

        />
      </BgWrapper>
    </div>
  );
}

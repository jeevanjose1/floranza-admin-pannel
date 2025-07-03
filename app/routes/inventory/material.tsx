import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import PermissionWrapper from "~/components/common/permission-wrapper";
import { MaterialTable } from "~/components/screens/material/material-table";
import MaterialTableHeader from "~/components/screens/material/material-table-header";
import { Button } from "~/components/ui/button";
import useQueryParams from "~/hooks/use-query-param";
import { permission_loader } from "~/lib/utils";
import { useListMaterial } from "~/services/queries";

export const clientLoader = ()=> permission_loader('materials:view')


export default function Material() {
  const { getAllParams } = useQueryParams();
  const query_params = getAllParams();
  const {
    data: material_data,
    isLoading,
    isFetching,
  } = useListMaterial({
    page: query_params.page,
    keyword: query_params.search,
    status: query_params.status,
    date: query_params.date,
  });

  const filtred_material =
    material_data?.data?.data?.map((item: any) => {
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
      <PageHeader title="Materials">
        <PermissionWrapper permission="materials:create">
          <div className="flex items-center gap-2 ">
            <Link to={"/materials/new"}>
              <Button variant={"secondary"} size={"sm"}>
                Add material
              </Button>
            </Link>
          </div>
        </PermissionWrapper>
      </PageHeader>
      <BgWrapper>
        <MaterialTableHeader />
        <MaterialTable
          is_next={material_data?.data?.next_page_url}
          current_page={material_data?.data?.current_page}
          is_previous={material_data?.data?.prev_page_url}
          loading={isFetching || isLoading}
          table_data={filtred_material}
        />
      </BgWrapper>
    </div>
  );
}

import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { SupplierTable } from "~/components/screens/supplier/supplier-table";
import SupplierTableHeader from "~/components/screens/supplier/supplier-table-header";
import { Button } from "~/components/ui/button";
import useQueryParams from "~/hooks/use-query-param";
import { useListBrand } from "~/services/queries";
import { useListSupplier } from "~/services/queries/supplier";

type Props = {};

export default function Supplier({}: Props) {
  const { getAllParams } = useQueryParams();
  const query_params = getAllParams();
  const {
    data: supplier_data,
    isLoading,
    isFetching,
  } = useListSupplier({
    page: query_params.page,
    keyword: query_params.search,
    status: query_params.status,
    date: query_params.date,
    per_page:10
  });

  const filtred_supplier =
    supplier_data?.data?.data?.map((item: any) => {
      return {
        id: item?.id,
        name: item?.name,
        description: item?.description,
        status: item?.status === 1 ? "Active" : "Inactive",
        image: item?.image?.mini,
        slug: item?.slug,
        hsn: item?.hsn_code,
        count: item?.product_count,
      };
    }) || [];

  return (
    <div>
      <PageHeader title="Supplier">
        <div className="flex items-center gap-2 ">
          <Link to={"/supplier/new"}>
            <Button variant={"secondary"} size={"sm"}>
              Add Supplier
            </Button>
          </Link>
        </div>
      </PageHeader>
      <BgWrapper>
        <SupplierTableHeader />
        <SupplierTable
          is_next={supplier_data?.data?.next_page_url}
          current_page={supplier_data?.data?.current_page}
          is_previous={supplier_data?.data?.prev_page_url}
          table_data={filtred_supplier}
          loading={isFetching || isLoading}
        />
      </BgWrapper>
    </div>
  );
}

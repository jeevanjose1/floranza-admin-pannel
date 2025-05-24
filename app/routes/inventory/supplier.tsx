import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { SupplierTable } from "~/components/screens/supplier/supplier-table";
import SupplierTableHeader from "~/components/screens/supplier/supplier-table-header";
import { Button } from "~/components/ui/button";
import { useListBrand } from "~/services/queries";
import { useListSupplier } from "~/services/queries/supplier";

type Props = {};

export default function Supplier({}: Props) {
  const {data:supplier_data,isLoading,isFetching} = useListSupplier({page:1})

  const filtred_supplier = supplier_data?.data?.data?.map((item:any)=>{
    return {
      id:item?.id,
      name:item?.name,
      description:item?.description,
      status:item?.status  ===1 ? 'Active':'Inactive',
      image:item?.image?.mini,
      slug:item?.slug,
      hsn:item?.hsn_code,
      count:45
    }
  })||[]

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
        <SupplierTable table_data={filtred_supplier} loading={isFetching||isFetching}/>
      </BgWrapper>
    </div>
  );
}

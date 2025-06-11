import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { MaterialTable } from "~/components/screens/material/material-table";
import MaterialTableHeader from "~/components/screens/material/material-table-header";
import { Button } from "~/components/ui/button";
import { useListMaterial } from "~/services/queries";

type Props = {};

export default function Material({}: Props) {
  const {data:material_data,isLoading,isFetching} = useListMaterial({page:1})
  
  const filtred_material = material_data?.data?.data?.map((item:any)=>{
    return {
      id:item?.id,
      name:item?.name,
      description:item?.description,
      status:item?.status  ===1 ? 'Active':'Inactive',
      image:item?.image?.mini,
      slug:item?.slug,
      count:45
    }
  })||[]
  return (
    <div>
      <PageHeader title="Materials">
        <div className="flex items-center gap-2 ">
          <Link to={"/materials/new"}>
            <Button variant={"secondary"} size={"sm"}>
              Add material
            </Button>
          </Link>
        </div>
      </PageHeader>
      <BgWrapper>
        <MaterialTableHeader/>
        <MaterialTable loading={isFetching||isLoading} table_data={filtred_material}/>
      </BgWrapper>
    </div>
  );
}

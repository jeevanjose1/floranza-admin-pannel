import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { CatogeryTable } from "~/components/screens/catogery/catogery-table";
import CatogeryTableHeader from "~/components/screens/catogery/catogery-table-header";
import { Button } from "~/components/ui/button";
import { useListCatogery } from "~/services/queries";

type Props = {};

export default function Catogery({}: Props) {
  const {data:catogery_data,isLoading,isFetching} = useListCatogery({page:1})
  
  const filterd_catogery = catogery_data?.data?.data?.map((item:any)=>{
    return {
      id:item?.id,
      name:item?.name,
      description:item?.description,
      status:item?.status,
      slug:item?.slug,
      image:item?.image.mini,
      count:4
    }
  })||[]
  return (
    <div>
      <PageHeader title="Catogery">
        <div className="flex items-center gap-2 ">
          <Link to={"/catogery/new"}>
            <Button variant={"secondary"} size={"sm"}>
              Add Catogery
            </Button>
          </Link>
        </div>
      </PageHeader>
      <BgWrapper>
        <CatogeryTableHeader />
        <CatogeryTable loading={isFetching||isLoading} table_data={filterd_catogery} />
      </BgWrapper>
    </div>
  );
}

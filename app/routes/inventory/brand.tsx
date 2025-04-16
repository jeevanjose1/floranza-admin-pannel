import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { BrandTable } from "~/components/screens/brands/brand-table";
import BrandTableHeader from "~/components/screens/brands/brand-table-header";
import { Button } from "~/components/ui/button";
import { useListBrand } from "~/services/queries";

type Props = {};

export default function Brand({}: Props) {
  const {data:brand_data,isLoading,isFetching} = useListBrand({page:1})
 
  const filtred_brand = brand_data?.data?.data?.map((item:any)=>{
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
  })
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
        <BrandTable table_data={filtred_brand} loading={isFetching||isFetching}/>
      </BgWrapper>
    </div>
  );
}

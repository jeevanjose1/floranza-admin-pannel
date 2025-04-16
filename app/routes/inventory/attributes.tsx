import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import AddEditModal from "~/components/screens/attributes/add-edit-modal";
import { AttributeTable } from "~/components/screens/attributes/attribute-table";
import AttributeTableHeader from "~/components/screens/attributes/attribute-table-header";
import dayjs from'dayjs'
import { Button } from "~/components/ui/button";
import { useListAttribute } from "~/services/queries";

type Props = {};

export default function Attributes({}: Props) {
  const {data:attribute_data,isLoading} = useListAttribute({page:1})
   
  const filtred_attribute = attribute_data?.data?.map((item:any)=>{
    return {
     id:item?.id,
      name:item?.name,
      items:item?.attribute_options,
      values_count:item?.attribute_options?.length,
      date:dayjs().format('DD/MM/YYYY'),
      status:item?.status
    }
  })
  return (
    <div>
      <PageHeader title="Attribute">
        <div className="flex items-center gap-2 ">
            <AddEditModal >
            <Button variant={"secondary"} size={"sm"}>
              Add Attribute
            </Button>
            </AddEditModal>
         
        </div>
      </PageHeader>
      <BgWrapper>
        <AttributeTableHeader />
        <AttributeTable table_data={filtred_attribute} loading={isLoading}/>
      </BgWrapper>
    </div>
  );
}

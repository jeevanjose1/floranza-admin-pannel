import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import AddEditModal from "~/components/screens/attributes/add-edit-modal";
import { AttributeTable } from "~/components/screens/attributes/attribute-table";
import AttributeTableHeader from "~/components/screens/attributes/attribute-table-header";
import dayjs from "dayjs";
import { Button } from "~/components/ui/button";
import { useListAttribute } from "~/services/queries";
import useQueryParams from "~/hooks/use-query-param";

type Props = {};

export default function Attributes({}: Props) {
  const { getAllParams } = useQueryParams();
  const query_params = getAllParams();
  const { data: attribute_data, isLoading } = useListAttribute({
    page: query_params.page,
    keyword: query_params.search,
    status: query_params.status,
  });

  const filtred_attribute =
    attribute_data?.data?.map((item: any) => {
      return {
        id: item?.id,
        name: item?.name,
        items: item?.attribute_options,
        values_count: item?.attribute_options?.length,
        date: dayjs().format("DD/MM/YYYY"),
        status: item?.status === 1 ? "Active" : "Inactive",
      };
    }) || [];
  return (
    <div>
      <PageHeader title="Attribute">
        <div className="flex items-center gap-2 ">
          <AddEditModal>
            <Button variant={"secondary"} size={"sm"}>
              Add Attribute
            </Button>
          </AddEditModal>
        </div>
      </PageHeader>
      <BgWrapper>
        <AttributeTableHeader />
        <AttributeTable
          is_next={attribute_data?.data?.next_page_url}
          current_page={attribute_data?.data?.current_page}
          is_previous={attribute_data?.data?.prev_page_url}
          table_data={filtred_attribute}
          loading={isLoading}
        />
      </BgWrapper>
    </div>
  );
}

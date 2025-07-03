import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import PermissionWrapper from "~/components/common/permission-wrapper";

import AddEditSliderModal from "~/components/screens/slider/add-edit-slider";
import { SliderTable } from "~/components/screens/slider/slider-table";
import SliderTableHeader from "~/components/screens/slider/slider-table-header";
import { Button } from "~/components/ui/button";
import useQueryParams from "~/hooks/use-query-param";
import { permission_loader } from "~/lib/utils";
import { useListSlider } from "~/services/queries/slider";

export const clientLoader = ()=> permission_loader('slider:view')

export default function Slider() {
  const { getAllParams } = useQueryParams();
  const query_params = getAllParams();
  const {
    data: slider_data,
    isLoading,
    isFetching,
  } = useListSlider({ page: query_params.page, keyword: query_params.search });

  const filtred_brand =
    slider_data?.data?.data?.map((item: any) => {
      return {
        id: item?.id,
        title: item?.headTitle,
        sub_title: item?.subTitle,
        is_btn: item?.buttonShow === 1 ? "YES" : "NO",
        btn_title: item?.buttonTitle ? item?.buttonTitle : "-",
        image: item?.image,
        btn_url: item?.buttonURl,
        order: item?.display_order,
      };
    }) || [];
  return (
    <div>
      <PageHeader title="Home Slider">
        <PermissionWrapper permission="slider:create">
          <div className="flex items-center gap-2 ">
            <AddEditSliderModal>
              <Button variant={"secondary"} size={"sm"}>
                Add Slider
              </Button>
            </AddEditSliderModal>
          </div>
        </PermissionWrapper>

      </PageHeader>
      <BgWrapper>
        <SliderTableHeader />
        <SliderTable
          is_next={slider_data?.data?.next_page_url}
          current_page={slider_data?.data?.current_page}
          is_previous={slider_data?.data?.prev_page_url}
          table_data={filtred_brand}
          loading={isLoading || isFetching}
        />
      </BgWrapper>
    </div>
  );
}

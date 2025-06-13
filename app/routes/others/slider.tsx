import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { BrandTable } from "~/components/screens/brands/brand-table";
import BrandTableHeader from "~/components/screens/brands/brand-table-header";
import AddEditSliderModal from "~/components/screens/slider/add-edit-slider";
import { SliderTable } from "~/components/screens/slider/slider-table";
import SliderTableHeader from "~/components/screens/slider/slider-table-header";
import { Button } from "~/components/ui/button";
import useQueryParams from "~/hooks/use-query-param";
import { useListBrand } from "~/services/queries";
import { useListSlider } from "~/services/queries/slider";

type Props = {};

export default function Slider({}: Props) {
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
        <div className="flex items-center gap-2 ">
          <AddEditSliderModal>
            <Button variant={"secondary"} size={"sm"}>
              Add Slider
            </Button>
          </AddEditSliderModal>
        </div>
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

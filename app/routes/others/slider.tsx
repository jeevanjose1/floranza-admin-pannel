import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { BrandTable } from "~/components/screens/brands/brand-table";
import BrandTableHeader from "~/components/screens/brands/brand-table-header";
import AddEditSliderModal from "~/components/screens/slider/add-edit-slider";
import { SliderTable } from "~/components/screens/slider/slider-table";
import SliderTableHeader from "~/components/screens/slider/slider-table-header";
import { Button } from "~/components/ui/button";
import { useListBrand } from "~/services/queries";
import { useListSlider } from "~/services/queries/slider";

type Props = {};

export default function Slider({}: Props) {
	const {data:slider_data,isLoading,isFetching} = useListSlider({page:1})

	const filtred_brand = slider_data?.data?.data?.map((item:any)=>{
		return {
			id:item?.id,
			title:item?.headTitle,
			sub_title:item?.subTitle,
			is_btn:item?.buttonShow ===1 ? 'YES':'NO',
			btn_title:item?.buttonTitle ? item?.buttonTitle :'-',
			image:item?.image,
            btn_url:item?.buttonURl,
            order:item?.display_order
	}
	}) || []
	return (
		<div>
			<PageHeader title="Brand">
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
			<SliderTable table_data={filtred_brand} loading={isLoading||isFetching}/>
		</BgWrapper>
	</div>
	);
}

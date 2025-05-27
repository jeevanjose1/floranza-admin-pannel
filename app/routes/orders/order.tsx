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
	
	return (
		<div>
			<PageHeader title="Orders">
				<div className="flex items-center gap-2 ">
			
		</div>
		</PageHeader>
		<BgWrapper>
		dfs
		</BgWrapper>
	</div>
	);
}

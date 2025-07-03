import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import BrandForm from "~/components/screens/add-edit-brand/brand-form";
import { Button } from "~/components/ui/button";
import { permission_loader } from "~/lib/utils";

export const clientLoader = ()=> permission_loader(['brands:create','brands:edit'])

export default function AddEditBrand() {
	const params = useParams()
	const navigate = useNavigate()

	return (
		<div className="container-md">
			<Button
				variant={"ghost"}
				onClick={()=>navigate(-1)}

				className="hover:bg-transparent text-lg has-[>svg]:px-0 mb-3"
			>
				<ArrowLeft />
				{params.cat_id?'Edit':'Add'} Brand
			</Button>
			<BrandForm id={params?.brand_id} />
		</div>
	);
}

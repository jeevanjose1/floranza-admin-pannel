import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router";
import BrandForm from "~/components/screens/add-edit-brand/brand-form";
import { Button } from "~/components/ui/button";

type Props = {};

export default function AddEditBrand({}: Props) {
  const params = useParams()

  return (
    <div className="container-md">
      <Button
        variant={"ghost"}
        className="hover:bg-transparent text-lg has-[>svg]:px-0 mb-3"
      >
        <ArrowLeft />
        {params.cat_id?'Edit':'Add'} Brand
      </Button>
      <BrandForm id={params?.brand_id}  />
    </div>
  );
}

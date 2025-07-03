import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import CatogeryForm from "~/components/screens/add-edit-catogery/catogery-form";
import { Button } from "~/components/ui/button";
import { permission_loader } from "~/lib/utils";

export const clientLoader = ()=> permission_loader(['categories:create','categories:edit'])

export default function AddEditCatogery() {
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
        {params.cat_id?'Edit':'Add'} Catogery
      </Button>
      <CatogeryForm id={params?.cat_id} />
    </div>
  );
}

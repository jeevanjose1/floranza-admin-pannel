import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import MaterialForm from "~/components/screens/add-edit-material/material-form";
import { Button } from "~/components/ui/button";

type Props = {};

export default function AddEditMaterial({}: Props) {
  const params = useParams()
    	const navigate = useNavigate()

  return (
    <div className="container-md">
      <Button
              	onClick={()=>navigate(-1)}

        variant={"ghost"}
        className="hover:bg-transparent text-lg has-[>svg]:px-0 mb-3"
      >
        <ArrowLeft />
        {params.cat_id?'Edit':'Add'} Material
      </Button>
      <MaterialForm id={params?.material_id} />
    </div>
  );
}

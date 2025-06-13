import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import SupplierForm from "~/components/screens/add-edit-supplier/supplier-form";
import { Button } from "~/components/ui/button";

type Props = {};

export default function AddEditSupplier({}: Props) {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <div className="container-md">
      <Button
        onClick={() => navigate(-1)}
        variant={"ghost"}
        className="hover:bg-transparent text-lg has-[>svg]:px-0 mb-3"
      >
        <ArrowLeft />
        {params.cat_id ? "Edit" : "Add"} Supplier
      </Button>
      <SupplierForm id={params?.supplier_id} />
    </div>
  );
}

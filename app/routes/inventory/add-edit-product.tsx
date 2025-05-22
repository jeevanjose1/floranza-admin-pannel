import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import ProductForm from "~/components/screens/add-edit-product/product-form";
import { Button } from "~/components/ui/button";

export default function AddEditProduct() {
  const params = useParams()
  const navigate = useNavigate()
  return (
    <div className="container-md ">
      <Button
        variant={"ghost"}
        onClick={()=>navigate(-1)}
        className="hover:bg-transparent text-lg has-[>svg]:px-0 mb-3"
      >
        <ArrowLeft />
       {params?.product_id ? 'Edit Product' :  `Add Product`}
      </Button>
      <ProductForm />
    </div>
  );
}

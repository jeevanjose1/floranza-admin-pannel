import { ArrowLeft } from "lucide-react";
import ProductForm from "~/components/screens/products/add-edit-product/product-form";
import { Button } from "~/components/ui/button";

export default function AddEditProduct() {
  return (
    <div className="container-md">
      <Button
        variant={"ghost"}
        className="hover:bg-transparent text-lg has-[>svg]:px-0 mb-3"
      >
        <ArrowLeft />
        Add Product
      </Button>
      <ProductForm />
    </div>
  );
}

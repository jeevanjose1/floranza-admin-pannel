import { useForm } from "react-hook-form";
import BasicDetails from "./basic-details";
import Price from "./price";
import Seo from "./seo";
import Status from "./status";
import CatogerySelect from "./catogery-select";
import { Button } from "~/components/ui/button";

type Props = {};

export default function ProductForm({}: Props) {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      media: [],
      catogery: "",
      categories: [],
      is_variants:false,
      attributes:[{
        name:'',
        key:'',
        value:[''],
        is_add:false

      }]
    },
  });  


  return (
    <div className="container-md">
    
      <form
        onSubmit={form?.handleSubmit(() => {})}
        action=""
        className="flex w-full gap-3 "
      >
        <div className="flex-1/2 grid gap-3">
          <BasicDetails form={form} />
          <Price form={form} />
          <Seo form={form}/>
          <div className="flex justify-end">
          <Button type="submit">Add Product</Button>
        </div>
        </div>
        <div className="flex-1/12 flex flex-col gap-3 sticky top-12">
        <Status form={form}/>
        <CatogerySelect form={form}/>
        </div>

        
      </form>
    </div>
  );
}

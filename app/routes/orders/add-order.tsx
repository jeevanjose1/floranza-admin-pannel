import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";
import BgWrapper from "~/components/common/bg-wrapper";
import CustomerDetails from "~/components/screens/add-order/customer-deails";
import SelectProduct from "~/components/screens/add-order/select-product";
import SelectedProduct from "~/components/screens/add-order/selected-product";
import { Button } from "~/components/ui/button";
import { useAddOrder } from "~/services/queries/order";
import { new_order_schema } from "~/shared/validations/order";

type Props = {};
type OrderFormData = z.infer<typeof new_order_schema>;

export default function AddOrder({}: Props) {
  const navigate = useNavigate();
  const {mutateAsync:add,isPending} = useAddOrder()
  const form = useForm<OrderFormData>({
    resolver: zodResolver(new_order_schema),
    defaultValues: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      country: "",
      phone: "",
      postcode: "",
      state: "",
      courier: "",
      note: "",
      email: "",
      products: [],
    },
  });

  const handleAddOrder = (values: OrderFormData) => {

    const product_data = values?.products?.map((item:any)=>{
      return {
          product_id: item?.product_id,
          prd_var_value_id: item?.var_value_id ? item?.var_value_id : null,
          qty: item?.qty,
        }
      
    })

    const data = {
      fname: values.fullName,
      country: values.country,
      address_1: values.addressLine1,
      city: values.city,
      state: values.state,
      postcode: values.postcode,
      phone: values.phone,
      email: values.email,
      courier:values.courier,
      notes: values.note,
      products:  product_data,
    };
add(data,{
  onSuccess:()=>{
    toast.success('Order created')
    navigate('/orders/reserved')

  },
  onError:()=>{
    toast.error('Order creation faild')

  }
})
  };

  return (
    <div className="container-md">
      <Button
        variant={"ghost"}
        onClick={() => navigate(-1)}
        className="hover:bg-transparent text-lg has-[>svg]:px-0 mb-3"
      >
        <ArrowLeft />
        Add Order
      </Button>
      <form onSubmit={form?.handleSubmit(handleAddOrder)} className="space-y-4 ">
        <div className="flex gap-4 ">
          <div className="flex-1 flex flex-col gap-4">
            <BgWrapper title="Select Product">
              <SelectProduct form={form} />
            </BgWrapper>
            {Boolean(form.watch("products")?.length) && (
              <BgWrapper title="Selected Product">
                <SelectedProduct form={form} />
              </BgWrapper>
            )}
            <BgWrapper title="Customer Details">
              <CustomerDetails form={form} />
            </BgWrapper>
          </div>
        </div>
        <div className="flex mt-4 items-center justify-end">
          <Button
            type="submit"
            size={"sm"}
            variant="secondary"
            className="w-36"
            loading={isPending}
          >
            Add Order
          </Button>
        </div>
      </form>
    </div>
  );
}

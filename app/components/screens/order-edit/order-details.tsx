import { Separator } from "~/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Trash } from "lucide-react";
import { PopConfirm } from "~/components/ui/pop-confirm";
import BgWrapper from "~/components/common/bg-wrapper";
import { useOrderItemDelete } from "~/services/queries/order";
import { toast } from "sonner";
import AddOrderItems from "./add-order-items";
import { useParams } from "react-router";

type Props = { data: any };

export default function OrderDetails({ data }: Props) {
  const params = useParams()
  const { mutateAsync: delete_item } = useOrderItemDelete()
  const order_item =
    data?.order_items?.map((item: any, index: number) => {
      return {
        id: item?.product_name + index,
        name: item?.product_name,
        image: item?.product_image,
        sku: item?.sku,
        size: item?.product_variation,
        costIncludingTax: Number(item?.price),
        cost: Number(item?.price),
        quantity: item?.qty,
        total: Number(item?.price),
        cgst: Number(item?.gst),
        sgst: Number(item?.gst),
        item_id: item?.item_id
      };
    }) || [];

  const handleDelete = (id: string) => {
    toast.promise(delete_item(id), {
      loading: 'Deleting item',
      success: 'Item deleted',
      error: (err) => {
        return 'Falid to delete'
      }
    })

  }

  const subtotal = Number(data?.price);
  const shipping = Number(data?.shipping_charge);
  const totalCGST = Number(data?.gst) || 0;
  const totalSGST = Number(data?.gst) || 0;
  const orderTotal = Number(data?.price);
  const amountPaid = Number(data?.price);
  const is_delete = () => {
    if (String(data?.order_status) === '1' || String(data?.order_status) === '9' || String(data?.order_status) === '10') return true
    else return false
  }
  console.log(params?.order_menu);

  return (
    <BgWrapper title={<div className="w-full flex items-center justify-between">
      <p>Order Details</p>
      <AddOrderItems current_item={data?.order_items
      }><Button size={'sm'}>Add items</Button></AddOrderItems>
    </div>}  >
      <div className=" mx-auto space-y-6">
        <div>
          {/* Order Items Table */}

          {Boolean(order_item?.length) ? <Table className="mb-4">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Product Details</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">CGST</TableHead>
                <TableHead className="text-right">SGST</TableHead>
                <TableHead className="text-right"></TableHead>

              </TableRow>
            </TableHeader>
            <TableBody>
              {order_item?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="pr-0 py-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="min-w-20 min-h-24 object-cover rounded-sm border"
                    />
                  </TableCell>
                  <TableCell className="align-top py-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium whitespace-pre-wrap leading-tight">
                        {item.name}
                      </p>
                      <div className="flex flex-col gap-1 text-xs text-gray-600">
                        <span>
                          <span className="font-medium">SKU:</span> {item.sku}
                        </span>
                        <span>
                          <span className="font-medium"> Size:</span> {item.size}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-right align-top py-3 font-medium">
                    ₹{item.cost.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center align-top py-3">
                    x {item.quantity}
                  </TableCell>
                  <TableCell className="text-right align-top py-3 font-medium">
                    ₹{item.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right align-top py-3">
                    ₹{item.cgst.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right align-top py-3">
                    ₹{item.sgst.toFixed(2)}
                  </TableCell>
                  {is_delete() && <TableCell className="text-right align-top py-3">
                    <PopConfirm action={() => handleDelete(item?.item_id)} description="Are you really want to delete this item?" title="Delete item">
                      <Button size={'icon'} variant={'destructive'} className="w-6 h-6 [&_svg:not([class*='size-'])]:size-3 rounded-sm">
                        <Trash />
                      </Button>
                    </PopConfirm>
                  </TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table> :
            <div className="w-full h-44 flex items-center justify-center">
              <p className="text-sm">Items not found!</p>
            </div>
          }

          {/* Order Summary */}
          <Card className="bg-muted/10  border-none shadow-none rounded-none">
            <CardHeader className="px-4">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Items Subtotal:</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Shipping:</span>
                  <span className="font-medium">
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">CGST:</span>
                  <span className="font-medium">₹{totalCGST.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">SGST:</span>
                  <span className="font-medium">₹{totalSGST.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Order Total:</span>
                  <span>₹{orderTotal.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount Paid:</span>
                  <Badge
                    variant="secondary"
                    className="text-sm rounded-sm bg-green-200"
                  >
                    ₹{amountPaid.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BgWrapper>
  );
}

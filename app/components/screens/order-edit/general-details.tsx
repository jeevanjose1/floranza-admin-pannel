import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
  Calendar,
  CreditCard,
  Truck,
  MapPin,
  Mail,
  Phone,
  Clock,
  ListOrdered,
} from "lucide-react";
import EditShippingAddress from "./edit-shipping-address";
import { status_filter, status_options } from "~/shared/others/others";
import { Button } from "~/components/ui/button";
import {
  usePaymentStatus,
  useSingleInvoice,
  useSingleStatus,
} from "~/services/queries/order";
import { toast } from "sonner";
import { download_pdf } from "~/lib/utils";
import { PopConfirm } from "~/components/ui/pop-confirm";
import { useState } from "react";
import { useNavigate } from "react-router";

type Props = { data: any };

export default function GeneralDetails({ data }: Props) {
  const { mutateAsync: download, isPending } = useSingleInvoice();
  const navigate = useNavigate();
  const [selectStatus, setSelectStatus] = useState("");
  const { mutateAsync: change, isPending: isStatusChanging } =
    useSingleStatus();
  const { mutateAsync: mark, isPending: markPending } = usePaymentStatus();
  const is_paid = Boolean(data?.paid_status)
  const downloadInvoice = () => {
    download(
      { id: data.id },
      {
        onSuccess: (response) => {
          toast.success("Invoice generated");
          download_pdf(response, data?.order_no);
        },
        onError: () => {
          toast.error("Failed to generate invoice");
        },
      }
    );
  };

  const handleMarkAsPaid = () => {
    const form_data = new FormData();
    form_data.append("paid_status", is_paid ? '0': "1");
    mark(
      {
        data: form_data,
        id: data?.id,
      },
      {
        onSuccess: () => {
          toast.success("Payment status changed");
        },
        onError:()=>{
          toast.error('Error while changing payment status')
        }
      }
    );
  };

  const handleStatusChange = (value: string) => {
    setSelectStatus(value);
  };

  const handleStatusUpdate = () => {
    const form_data = new FormData();
    form_data.append("status", selectStatus);

    change(
      {
        id: data.id,
        data: form_data,
      },
      {
        onSuccess: () => {
          toast.success("Status updated successfully");
          navigate(-1);
        },
        onError: () => {
          toast.error("Failed to update status");
        },
      }
    );
  };
  const currentStatus = status_options.find(
    (s) => s.status === data?.order_status
  );
  const statusName = currentStatus?.name || "Unknown";
  const statusColor =
    currentStatus?.color || "bg-gray-50 text-gray-500 border-gray-300";

  return (
    <div className="p-4 space-y-4 ">
      <Card className="border-0 bg-muted/20 rounded-md shadow-none">
        <CardContent className="flex justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                  Order #{data?.order_no}
                </h1>
                {is_paid && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 hover:bg-green-100"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Paid
                  </Badge>
                )}
              </div>

              {is_paid ? (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    {data?.payment_gateway}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Paid on {data?.date_normal_format}
                  </p>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="flex items-center gap-2">
                    <ListOrdered className="w-4 h-4" />
                    {data?.order_via}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Order on {data?.date}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex  gap-3">
            {status_filter(String(data?.order_status))?.invoice && (
              <Button onClick={downloadInvoice} loading={isPending} size={"sm"}>
                {isPending ? "Generating Invoice" : "Download Invoice"}
              </Button>
            )}
            {data?.order_status === 10 && (
              <PopConfirm
              action={handleMarkAsPaid}
                title={is_paid ? 'Remove status':"Mark as paid"}
                description="Are you really want to change the status"
              >
                <Button loading={markPending} variant={"secondary"} size={"sm"}>
                 {is_paid?'Remove Paid Status':'Mark As Paid' }
                </Button>
              </PopConfirm>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-4">
        {/* General Section */}
        <Card className="shadow-none gap-4 border-0 rounded-md  bg-muted/20">
          <CardHeader>
            <CardTitle className=" flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 " />
              General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full space-y-2">
              <Label htmlFor="date-created"> Created At</Label>
              <p className="text-sm font-medium my-2">{data?.date}</p>
            </div>

            {status_filter(String(data?.order_status)).updates?.length > 0 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Badge
                    variant="outline"
                    className={`${statusColor} text-xs font-medium px-3 py-1.5 rounded-full border`}
                  >
                    {statusName}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Change Status</Label>
                  <Select onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {status_filter(String(data?.order_status)).updates?.map(
                        (item: any) => {
                          return (
                            <SelectItem key={item.value} value={item.value}>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                {item.label}
                              </div>
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full flex justify-end">
                  <PopConfirm
                    title="Update status"
                    description="Are you really want to update the status?"
                    action={handleStatusUpdate}
                  >
                    <Button
                      size={"sm"}
                      disabled={
                        selectStatus === data?.order_status || isStatusChanging
                      }
                      loading={isStatusChanging}
                    >
                      {isStatusChanging ? "Updating..." : "Update Status"}
                    </Button>
                  </PopConfirm>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Billing Section */}
        <Card className="shadow-none gap-4 rounded-md  border-0 bg-muted/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className=" flex items-center gap-2">
                <CreditCard className="w-4.5 h-4.5" />
                Billing
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="text-[13px] space-y-1">
                <p className="font-medium text-foreground">
                  {data?.address?.fname}
                </p>
                <div className="text-muted-foreground leading-relaxed">
                  {data?.address?.address_1}
                  <br />
                  {data?.address?.address_2}
                  {data?.address?.address_2 && <br />}
                  {data?.address?.city} {data?.address?.postcode}
                  <br />
                  {data?.address?.state}
                  {", "}
                  {data?.address?.country}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                {data?.address?.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Email address
                      </p>
                      <p className="text-sm">{data?.address?.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start  gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Phone
                    </p>
                    <p className="text-sm">{data?.address?.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Section */}
        <Card className="shadow-none gap-4 rounded-md  border-0 bg-muted/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className=" flex items-center gap-2">
                <Truck className="w-4.5 h-4.5 " />
                Shipping
              </CardTitle>
              <EditShippingAddress defaultValues={data} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-[13px]  space-y-1">
                  <div className="text-[13px] space-y-1">
                    <p className="font-medium text-foreground">
                      {data?.address?.fname}
                    </p>
                    <div className="text-muted-foreground leading-relaxed">
                      {data?.address?.address_1}
                      <br />
                      {data?.address?.address_2}
                      {data?.address?.address_2 && <br />}
                      {data?.address?.city} {data?.address?.postcode}
                      <br />
                      {data?.address?.state}
                      {", "}
                      {data?.address?.country}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 border border-orange-100 dark:border-orange-900/20">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="w-4 h-4 text-orange-600" />
                  <p className="text-xs font-medium text-orange-700 dark:text-orange-400 uppercase tracking-wide">
                    Courier
                  </p>
                </div>
                <p className="text-sm font-semibold text-orange-900 dark:text-orange-300">
                  {data?.courier?.replace("_", " ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

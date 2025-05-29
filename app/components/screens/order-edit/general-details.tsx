import React from "react";
import { DatePicker } from "~/components/ui/date-picker";
import { Input } from "~/components/ui/input";
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
import { Calendar, CreditCard, Truck, Edit, MapPin, Mail, Phone, Clock } from "lucide-react";
import TimePicker from "~/components/ui/time-picker";
import EditShippingAddress from "./edit-shipping-address";
import EditBillingAddress from "./edit-billing-address";
import { status } from "~/shared/others/others";

type Props = {data:any};

export default function GeneralDetails({data}: Props) {
  return (
    <div className="p-4 space-y-4 ">
      {/* Header Section */}
      <Card className="border-0 bg-muted/20 rounded-md shadow-none">
        <CardContent >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">Order #{data?.order_no}</h1>
                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                  <Clock className="w-3 h-3 mr-1" />
                  Paid
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment via PhonePe Payment Solutions (21966820250528134844)
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Paid on May 28, 2025 @ 7:19 pm
                </p>
                <p className="text-xs text-muted-foreground/70">Customer IP: 103.154.37.163</p>
              </div>
            </div>
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
                <Label htmlFor="date-created">Date created</Label>
                <DatePicker defaultDate={new Date(data?.date) } className=" min-w-36" />
              </div>
            <div className="w-full space-y-2">
                <Label htmlFor="date-created">Time created</Label>
                <TimePicker onChange={()=>{}} />
              </div>
            
          
  
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select>
                <SelectTrigger value={JSON.stringify(data?.order_status)} className="w-full">
                  <SelectValue  placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {status.map(item=>{
                    return <SelectItem value={item?.value}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      {item.label}
                    </div>
                  </SelectItem>
                  })}
                 
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Billing Section */}
        <Card className="shadow-none gap-4 rounded-md  border-0 bg-muted/20">
          <CardHeader >
            <div className="flex items-center justify-between">
              <CardTitle className=" flex items-center gap-2">
                <CreditCard className="w-4.5 h-4.5" />
                Billing
              </CardTitle>
              <EditBillingAddress defaultValues={data?.address}/>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="text-[13px] space-y-1">
                <p className="font-medium text-foreground">{data?.address?.fname}</p>
                <div className="text-muted-foreground leading-relaxed">
                  {data?.address?.address_1}<br />
                  {data?.address?.address_2}{ data?.address?.address_2&&<br />}
                  {data?.address?.city} {data?.address?.postcode}<br />
                  {data?.address?.state}{', '}
                   {data?.address?.country} 
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
               {data?.address?.email && <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Email address
                    </p>
                    <p className="text-sm">{data?.address?.email}</p>
                  </div>
                </div>}
                
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
          <CardHeader >
            <div className="flex items-center justify-between">
              <CardTitle className=" flex items-center gap-2">
                <Truck className="w-4.5 h-4.5 " />
                Shipping
              </CardTitle>
              <EditShippingAddress defaultValues={data?.address}/>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-[13px]  space-y-1">
                  <div className="text-[13px] space-y-1">
                <p className="font-medium text-foreground">{data?.address?.fname}</p>
                <div className="text-muted-foreground leading-relaxed">
                  {data?.address?.address_1}<br />
                  {data?.address?.address_2}{ data?.address?.address_2&&<br />}
                  {data?.address?.city} {data?.address?.postcode}<br />
                  {data?.address?.state}{', '}
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
                    Select Courier
                  </p>
                </div>
                <p className="text-sm font-semibold text-orange-900 dark:text-orange-300">INDIA POST</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { ProductTable, type Product } from "~/components/screens/products/product-table";
import ProductTableHeader from "~/components/screens/products/product-table-header";
import { Button } from "~/components/ui/button";
import { useListProduct } from "~/services/queries";

type Props = {};

export default function products({}: Props) {

  const {data:product_data,isLoading,isFetching} = useListProduct({page:1})
 
  const filter_product:Product[] = product_data?.data?.data?.map((item:any)=>{
    return {
      id: item.id,
      name: item?.name,
      sku:item?.sku,
      catogery:item?.product_categories,
      brand:item?.hsn,
      price: item?.reg_price,
      status: item?.status ===1 ? 'Active' : 'Inactive',
      date: dayjs(item?.created_at).format('DD-MM-YYYY') ,
      stock: item?.qty,
      image: item?.images?.[0]?.large,
      variations:item?.variations,
      scheduled:item?.is_scheduled,
      sheduled_at:item?.scheduled_at,
      prebook:item?.is_pre_order,
      preorder_at:item?.pre_end_at
    }
  }) || []

 
  return (
    <div>
      <PageHeader title="Products">
        <div className="flex items-center gap-2 ">
       
          <Link to={'/products/new'}>
          <Button variant={"secondary"} size={"sm"}>
            Add Product
          </Button>
          </Link>
         
        </div>
      </PageHeader>
      <BgWrapper>
        <ProductTableHeader/>
        <ProductTable  table_data={filter_product} loading={isFetching||isLoading}/>
      </BgWrapper>
    </div>
  );
}

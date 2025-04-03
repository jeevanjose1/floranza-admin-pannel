import React from "react";
import { Link } from "react-router";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import { ProductTable } from "~/components/screens/products/product-table";
import ProductTableHeader from "~/components/screens/products/product-table-header";
import { Button } from "~/components/ui/button";

type Props = {};

export default function products({}: Props) {
  return (
    <div>
      <PageHeader title="Products">
        <div className="flex items-center gap-2 ">
          <Button variant={"default"} size={"sm"}>
            Export
          </Button>
          <Button variant={"default"} size={"sm"}>
            Import
          </Button>
          <Link to={'/products/new'}>
          <Button variant={"secondary"} size={"sm"}>
            Add Product
          </Button>
          </Link>
         
        </div>
      </PageHeader>
      <BgWrapper>
        <ProductTableHeader/>
        <ProductTable/>
      </BgWrapper>
    </div>
  );
}

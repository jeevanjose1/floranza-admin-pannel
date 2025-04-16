import { ArrowLeft } from "lucide-react";
import React from "react";
import { useParams } from "react-router";
import CatogeryForm from "~/components/screens/add-edit-catogery/catogery-form";
import { Button } from "~/components/ui/button";

type Props = {};

export default function AddEditCatogery({}: Props) {
  const params = useParams()
  return (
    <div className="container-md">
      <Button
        variant={"ghost"}
        className="hover:bg-transparent text-lg has-[>svg]:px-0 mb-3"
      >
        <ArrowLeft />
        {params.cat_id?'Edit':'Add'} Catogery
      </Button>
      <CatogeryForm id={params?.cat_id} />
    </div>
  );
}

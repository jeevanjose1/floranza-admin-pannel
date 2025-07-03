import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import SizeChartForm from "~/components/screens/add-edit-size-chart/size-chart-form";
import { Button } from "~/components/ui/button";
import { permission_loader } from "~/lib/utils";

export const clientLoader = ()=> permission_loader(['size_charts:create','size_charts:edit'])


export default function AddEditSizeChart() {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <div className="container-lg">
      <Button
        onClick={() => navigate(-1)}
        variant={"ghost"}
        className="hover:bg-transparent text-lg has-[>svg]:px-0 mb-3"
      >
        <ArrowLeft />
        {params.cat_id ? "Edit" : "Add"} Size Chart
      </Button>
      <SizeChartForm  />
    </div>
  );
}

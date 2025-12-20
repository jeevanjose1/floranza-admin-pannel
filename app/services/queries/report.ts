import { useQuery } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import { REPORT } from "~/shared/urls";

const useListReport = (payload: any) => {

    const getUrl = ()=>{
        const urls : any = {
            order:REPORT.ORDER,
            top_selling:REPORT.TOP_SELLEING,
            pre_order:REPORT.PRE_ORDER
        }

        return urls?.[payload.type]
    }
  return useQuery({
    queryKey: ["ORDER_REPORT_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${getUrl()}${queryFilter(payload.filter)}`,
        type: "get",
      }),
      refetchOnWindowFocus:false
  });
};

const useListTopSellingReport = (payload: any) => {
  return useQuery({
    queryKey: ["TOP_SELLING_REPORT_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${REPORT.TOP_SELLEING}${queryFilter(payload)}`,
        type: "get",
      }),
      refetchOnWindowFocus:false
  });
};

const useListPreOrderReport = (payload: any) => {
  return useQuery({
    queryKey: ["PRE_ORDER_REPORT_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${REPORT.PRE_ORDER}${queryFilter(payload)}`,
        type: "get",
      }),
      refetchOnWindowFocus:false
  });
};


export {
    useListReport

}

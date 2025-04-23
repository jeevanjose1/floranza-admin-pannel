import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type { COMMON_LIST_PAYLOAD } from "~/shared/types";
import { PRODUCT } from "~/shared/urls";

const useListProduct = (payload: COMMON_LIST_PAYLOAD) => {
  return useQuery({
    queryKey: ["PRODUCT_LIST", payload],
    queryFn: () =>
      fetcher({
        url: `${PRODUCT.LIST}${queryFilter(payload)}`,
        type: "get",
      }),
  });
};

const useCreateProduct = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: PRODUCT.CREATE,
        type: "post",
        data: payload,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["PRODUCT_LIST"] });
      return response;
    },
    onError: (error) => error,
  });
};


export {
    useCreateProduct,
    useListProduct
}
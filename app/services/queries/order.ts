import { useQuery } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type { COMMON_LIST_PAYLOAD } from "~/shared/types";
import { ORDER } from "~/shared/urls/order";

const useOrderList = (payload: COMMON_LIST_PAYLOAD) => {
	return useQuery({
		queryKey: ["ORDER_LIST", payload],
		queryFn: () =>
			fetcher({
				url: `${ORDER.ORDER_LIST}${queryFilter(payload)}`,
				type: "get",
			}),
	});
};
const useOrderView = (payload: COMMON_LIST_PAYLOAD) => {
	return useQuery({
		queryKey: ["ORDER_VIEW", payload],
		queryFn: () =>
			fetcher({
				url: `${ORDER.ORDER_VIEW}/${payload}`,
				type: "get",
			}),
	});
};
const useOrderMenuList = (payload: COMMON_LIST_PAYLOAD) => {
	return useQuery({
		queryKey: ["MENU_LIST", payload],
		queryFn: () =>
			fetcher({
				url: `${ORDER.ORDER_MENU}`,
				type: "get",
			}),
	});
};

export {
    useOrderList,
    useOrderMenuList,
	useOrderView
}
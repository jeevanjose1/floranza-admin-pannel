import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, queryFilter } from "~/lib/utils";
import type { COMMON_LIST_PAYLOAD, COMMON_PAYLOAD, COMMON_MUTATION } from "~/shared/types";
import { SIZE_CHART } from "~/shared/urls/size-chart";

const useListChart = (payload: COMMON_LIST_PAYLOAD) => {
    return useQuery({
        queryKey: ["CHART_LIST", payload],
        queryFn: () =>
            fetcher({
                url: `${SIZE_CHART.LIST}${queryFilter(payload)}`,
                type: "get",
            }),
    });
};
const useListChartInProduct = () => {
    return useQuery({
        queryKey: ["CHART_LIST_PRODUCT"],
        queryFn: () =>
            fetcher({
                url: `${SIZE_CHART.SHOW_IN_PRODUCT}`,
                type: "get",
            }),
    });
};
const useChartDetails = (payload: COMMON_MUTATION['id']) => {
    return useQuery({
        queryKey: ["CHART_DETAILS", payload],
        queryFn: () =>
            fetcher({
                url: `${SIZE_CHART.SHOW}${payload}`,
                type: "get",
            }),
        enabled: payload ? true : false
    });
};
const useCreateChart = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) =>
            fetcher({
                url: SIZE_CHART.CREATE,
                type: "post",
                data: payload,
            }),
        onSuccess: (response) => {
            query.invalidateQueries({ queryKey: ["CHART_LIST"] });
            return response;
        },
        onError: (error) => error,
    });
};

const useDeleteChart = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: (payload: COMMON_MUTATION["id"]) =>
            fetcher({
                url: `${SIZE_CHART.DELETE}${payload}`,
                type: "delete",
            }),
        onSuccess: (response) => {
            query.invalidateQueries({ queryKey: ["CHART_LIST"] });
            return response;
        },
        onError: (error) => error,
    });
};
const useCloneChart = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: (payload: COMMON_MUTATION["id"]) =>
            fetcher({
                url: `${SIZE_CHART. CLONE}${payload}`,
                type: "get",
            }),
        onSuccess: (response) => {
            query.invalidateQueries({ queryKey: ["CHART_LIST"] });
            return response;
        },
        onError: (error) => error,
    });
};
const useUpadteChart = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) =>
            fetcher({
                url: `${SIZE_CHART.UPDATE}${payload?.id}`,
                type: "post",
                data: payload.data,
            }),
        onSuccess: (response) => {
            query.invalidateQueries({ queryKey: ["CHART_LIST"] });
            return response;
        },
        onError: (error) => error,
    });
};

export {
    useChartDetails,
    useCreateChart,
    useDeleteChart,
    useListChart,
    useUpadteChart,
    useListChartInProduct,
    useCloneChart
};

import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";

export default function useQueryParams() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const updateUrl = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value.toString());
        }
      });

      setSearchParams(params, { replace: true });
    },
    [navigate, searchParams]
  );

  const clearParams = useCallback(() => {
    setSearchParams("", { replace: true });
  }, [searchParams]);

  const replaceParams = useCallback(
    (newParams: Record<string, string | number>) => {
      const params = new URLSearchParams();
      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          params.set(key, value.toString());
        }
      });

      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  const getParam = useCallback(
    (key: string) => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  const getAllParams = useCallback(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  return {
    updateUrl,
    getParam,
    getAllParams,
    searchParams,
    clearParams,
    replaceParams,
  };
}

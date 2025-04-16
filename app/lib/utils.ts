import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import instance, { base_url } from "~/services/instance";
import type { FETCHER_TYPE } from "~/shared/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryFilter = (filter: object) => {
  const filterEntries = Object.entries(filter).filter(([_, value]) => {
    return (
      value !== undefined && value !== null && value !== "" && value !== "all"
    );
  });

  if (filterEntries.length === 0) {
    return "";
  }
  const filterString = filterEntries
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `?${filterString}`;
};

export const fetcher = async ({
  url,
  data,
  authenticated = true,
  type,
  headers,
  onUploadProgress,
}: FETCHER_TYPE) => {
  try {
    if (authenticated) {
      const response = await instance({
        method: type,
        url: url,
        data: data ? data : undefined,
        headers: headers,
        onUploadProgress: onUploadProgress,
      });
      return response.data;
    } else {
      const response = await axios({
        method: type,
        data: data ? data : undefined,
        url: `${base_url}${url}`,
        headers: headers,
      });
      return response.data;
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response;
    }
    throw error;
  }
};

export const is_auth = () => {
  if (typeof window === "undefined") return false 

  const details = localStorage.getItem("token")
  return !!details
}
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import instance, { base_url } from "../services/instance";
import type { FETCHER_TYPE } from "../shared/types";
import { QueryClient } from "@tanstack/react-query";
import { AUTH } from "../shared/urls";
import type { PERMISSIONS } from "~/shared/others/others";
import { routes } from "~/shared/routes/routes";

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
  rest,
}: FETCHER_TYPE) => {
  try {
    if (authenticated) {
      const response = await instance({
        method: type,
        url: url,
        data: data ? data : undefined,
        headers: headers,
        onUploadProgress: onUploadProgress,
        ...rest,
      });
      return response.data;
    } else {
      const response = await axios({
        method: type,
        data: data ? data : undefined,
        url: `${base_url}${url}`,
        headers: headers,
        ...rest,
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
  if (typeof window === "undefined") return false;

  const details = localStorage.getItem("token");
  return !!details;
};

export const input_restrictions = {
  numbersOnly: (e: any) => {
    e.target.value = e.target.value.replace(/[^0-9 .]/g, "");
  },

  textOnly: (e: any) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
  },

  lettersOnly: (e: any) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z]/g, "");
  },

  alphanumericOnly: (e: any) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
  },

  emailFormat: (e: any) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, "");
  },

  currencyFormat: (e: any) => {
    let value = e.target.value.replace(/[^0-9.]/g, "");

    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    e.target.value = value;
  },

  phoneFormat: (e: any) => {
    e.target.value = e.target.value.replace(/[^0-9+-\s()]/g, "");
  },

  dateFormat: (e: any) => {
    e.target.value = e.target.value.replace(/[^0-9/.-]/g, "");
  },

  urlFormat: (e: any) => {
    e.target.value = e.target.value.replace(
      /[^a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]/g,
      ""
    );
  },

  hexFormat: (e: any) => {
    e.target.value = e.target.value.replace(/[^0-9a-fA-F#]/g, "");
  },
};

export const transform_name = (string: string) => {
  return string?.toLowerCase()?.split(" ")?.join("-");
};

export const download_pdf = (response: any, name: string) => {
  const pdfBlob = new Blob([response], { type: "application/pdf" });

  const url = window.URL.createObjectURL(pdfBlob);
  const tempLink = document.createElement("a");
  tempLink.href = url;
  tempLink.setAttribute("download", `invoice-${name}.pdf`);
  document.body.appendChild(tempLink);
  tempLink.click();

  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(url);
};


export function capitalize_first_letters(sentence: string) {
  return sentence
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}


export const has_permission = (
  permission: string | string[] | undefined,
  permissions: string[]
): boolean => {

  if (!permission) return false; 

  if (typeof permission === 'string') {
    return permissions.includes(permission);
  }

  if (Array.isArray(permission)) {
    return permission.some((item: string) => permissions.includes(item));
  }

  return false; 
};


type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];


let permissionCache: {
  data: any;
  timestamp: number;
  ttl: number;
} | null = null;

// Cache TTL in milliseconds (default: 5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

export const permission_loader = async (
  permission: Permission | Permission[],
  options: { reload?: boolean; ttl?: number } = {}
) => {
  
  const now = Date.now();
  const cacheTtl = options.ttl || CACHE_TTL;
  
  // Check if we should use cached data
  const shouldUseCache = !options.reload && 
    permissionCache && 
    (now - permissionCache.timestamp) < permissionCache.ttl;
  
  let response;
  
  if (shouldUseCache) {
    // Use cached response
    response = permissionCache?.data;
  } else {
    // Fetch fresh data
    response = await fetcher({
      url: `${AUTH.PROFILE}`,
      type: "get",
    });
    
    // Update cache
    permissionCache = {
      data: response,
      timestamp: now,
      ttl: cacheTtl
    };
  }
  
  const permissions = response?.data?.user?.permission 
    ? JSON.parse(response?.data?.user?.permission) 
    : [];
  
  if (!has_permission(permission, permissions)) {
    throw new Response("Forbidden", { status: 403 });
  }
  
  return null;
};

export const clearPermissionCache = () => {
  permissionCache = null;
};

export const current_path = (current_permission:string[]) => {
    const filteredItems = routes
      .map((item) => {
        if (item.route) {
          const allowedSubItems = item.route.filter((subItem:any) =>
            has_permission(subItem.permission as any,current_permission)
          );
          if (allowedSubItems.length > 0) {
            return {
              items: allowedSubItems,
            };
          }
          return null;
        }
        return null;
      })
      .filter(Boolean)?.[0]
    return filteredItems;
  };
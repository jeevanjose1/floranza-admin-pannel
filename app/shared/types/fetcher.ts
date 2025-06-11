 type FETCHER_TYPE = {
    url: string;
    data?: unknown;
    authenticated?: boolean;
    type: "get" | "post" | "put" | "patch" | "delete";
    headers?:any;
    onUploadProgress?:any
rest?:any
  };

  export type {
    FETCHER_TYPE
  }
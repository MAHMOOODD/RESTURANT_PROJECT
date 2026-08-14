import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

// 1. تعريف شكل الـ ApiError ليدعم Generic
export type ApiError<TFields = Record<string, string[]>> = {
  status: number;
  message: string;
  errors: TFields | null;
};

// 2. تعريف شكل الـ Response القادم من السيرفر
type ApiErrorResponse<TFields = Record<string, string[]>> = {
  isSuccess: boolean;
  data: unknown | null;
  error: {
    statusCode: number;
    message: string;
    errors: TFields | null;
  } | null;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5153/api",
});

// 3. تحويل baseQuery لدالة تقبل Generic Type TFields بدلاً من any
export const baseQuery = <TFields = Record<string, string[]>>(): BaseQueryFn<
  string | FetchArgs,
  unknown,
  ApiError<TFields>
> => {
  return async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error) {
      return {
        error: normalizeError<TFields>(result.error),
      };
    }

    return {
      data: result.data as unknown,
      meta: result.meta,
    };
  };
};

// 4. تحويل دالة normalizeError لتكون Generic أيضاً
const normalizeError = <TFields = Record<string, string[]>>(
  error: FetchBaseQueryError
): ApiError<TFields> => {
  const status = typeof error.status === "number" ? error.status : 500;
  const data = error.data;

  // لو الـ API راجع بتفاصيل خطأ مرتبة
  if (typeof data === "object" && data !== null && "error" in data) {
    const response = data as ApiErrorResponse<TFields>;

    if (response.error) {
      return {
        status: response.error.statusCode,
        message: response.error.message,
        errors: response.error.errors,
      };
    }
  }

  // لو الـ API راجع بنص رسالة خطأ مباشرة
  if (typeof data === "string") {
    return {
      status,
      message: data,
      errors: null,
    };
  }

  // رسائل افتراضية حسب الـ Status Code
  const messages: Record<number, string> = {
    400: "Bad request",
    401: "Unauthorized",
    403: "You are not allowed to perform this action",
    404: "Resource not found",
    500: "Something went wrong on the server",
  };

  return {
    status,
    message: messages[status] ?? "Something went wrong",
    errors: null,
  };
};
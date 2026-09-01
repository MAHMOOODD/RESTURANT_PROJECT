import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store/index";
import { setCredentials, logout } from "@/store/features/User/authSlice";

export type ApiError<TFields = Record<string, string[]>> = {
  status: number;
  message: string;
  errors: TFields | null;
};

type ApiErrorResponse<TFields = Record<string, string[]>> = {
  isSuccess: boolean;
  data: unknown | null;
  message: string;
  error: {
    statusCode: number;
    message: string;
    errors: TFields | null;
  } | null;
};

interface RefreshTokenResponse {
  token?: string;
  data?: {
    token?: string;
  };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5153/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQuery = <TFields = Record<string, string[]>>(): BaseQueryFn<
  string | FetchArgs,
  unknown,
  ApiError<TFields>
> => {
  return async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      const url = typeof args === "string" ? args : args.url;
      const isAuthEndpoint =
        url.includes("Account/RefreshToken") || url.includes("Account/Login");

      if (!isAuthEndpoint) {
        const refreshResult = await rawBaseQuery(
          {
            url: "Account/RefreshToken",
            method: "POST",
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          const res = refreshResult.data as RefreshTokenResponse;
          const newToken = res?.data?.token || res?.token;

          if (newToken) {
            api.dispatch(setCredentials({ token: newToken }));

            if (typeof args === "string") {
              args = {
                url: args,
                headers: { authorization: `Bearer ${newToken}` },
              };
            } else {
              args = {
                ...args,
                headers: {
                  ...(args.headers as Record<string, string>),
                  authorization: `Bearer ${newToken}`,
                },
              };
            }

            result = await rawBaseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logout());
          }
        } else {
          api.dispatch(logout());
        }
      }
    }

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

const normalizeError = <TFields = Record<string, string[]>>(
  error: FetchBaseQueryError,
): ApiError<TFields> => {
  const status = typeof error.status === "number" ? error.status : 500;
  const data = error.data;

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

  if (typeof data === "string") {
    return {
      status,
      message: data,
      errors: null,
    };
  }

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
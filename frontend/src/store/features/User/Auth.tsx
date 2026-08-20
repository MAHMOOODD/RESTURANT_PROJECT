// services/authApi.ts
import { baseQuery } from "@/services/baseQuery";
import {
  type ApiResponse,
  type ResetPasswordDto,
  type ForgetPasswordDto,
  type RegisterModel,
  type ResponseLogin,
  type ResponseRegister,
  type TokenRequestModel,
  type ConfirmEmailDto,
  type RevokeToken, // إضافة النوع لو موجود عندك في types
} from "@/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    Login: builder.mutation<ApiResponse<ResponseLogin>, TokenRequestModel>({
      query: (credentials) => ({
        url: "Account/Login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    Register: builder.mutation<ApiResponse<ResponseRegister>, RegisterModel>({
      query: (credentials) => ({
        url: "Account/Register",
        method: "POST",
        body: credentials,
      }),
    }),
    ForgetPassword: builder.mutation<ApiResponse<void>, ForgetPasswordDto>({
      query: (credentials) => ({
        url: "Account/ForgetPassword",
        method: "POST",
        body: credentials,
      }),
    }),
    ResetPassword: builder.mutation<ApiResponse<void>, ResetPasswordDto>({
      query: (credentials) => ({
        url: "Account/ResetPassword",
        method: "POST",
        body: credentials,
      }),
    }),
    ConfirmEmail: builder.mutation<ApiResponse<void>, ConfirmEmailDto>({
      query: (credentials) => ({
        url: "Account/ConfirmEmail",
        method: "GET",
        params: credentials,
      }),
    }),
    CheckAuth: builder.query<ApiResponse<boolean>,void>({
      query: () => ({
        url: "User/IsAuth",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    // 1. ميثود إلغاء التوكن (تسجيل الخروج)
    RevokeToken: builder.mutation<ApiResponse<void>, RevokeToken | void>({
      query: (body) => ({
        url: "Account/RevokeToken", // أو حسب مسار الكنترولر عندك
        method: "POST",
        body: body ?? {}, // يرسل body فاضي إذا لم يتم تمرير token بالفرونت
      }),
      invalidatesTags: ["User"],
    }),
    // 2. ميثود تجديد الـ Access Token
    RefreshToken: builder.mutation<ApiResponse<ResponseLogin>, void>({
      query: () => ({
        url: "Account/RefreshToken",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgetPasswordMutation,
  useConfirmEmailMutation,
  useResetPasswordMutation,
  useCheckAuthQuery,
  useRevokeTokenMutation,
  useRefreshTokenMutation,
} = authApi;

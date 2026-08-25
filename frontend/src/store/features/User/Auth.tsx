import { baseQuery } from "@/services/baseQuery";
import type {
  ApiResponse,
  ResetPasswordDto,
  ForgetPasswordDto,
  RegisterModel,
  ResponseLogin,
  ResponseRegister,
  TokenRequestModel,
  ConfirmEmailDto,
  RevokeToken,
  UpdateProfileDto,
  AddRoleDto,
} from "@/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export interface GetUserInfo {
  fullName?: string;
  address?: string;
  phoneNumber?: string;
  userName: string;
  email: string;
  imageUrl?: string; // Optional, Regex: .+\.(jpg|jpeg|png|gif|webp)$
}

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
    CheckAuth: builder.query<ApiResponse<boolean>, void>({
      query: () => ({
        url: "User/IsAuth",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    GetRoles: builder.query<ApiResponse<string[]>, void>({
      query: () => ({
        url: "User/GetRoles",
        method: "GET",
      }),
    }),
    GetUserInfo: builder.query<GetUserInfo, void>({
      query: () => ({
        url: "User/UserInfo",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetUserInfo>) => response.data,
      providesTags: ["User"],
    }),
    UpdateProfile: builder.mutation<string, UpdateProfileDto>({
      query: (dto) => ({
        url: "Account/UpdateProfile",
        method: "PUT",
        body: dto,
      }),
      transformResponse: (response: ApiResponse<null>) => response.message,
      invalidatesTags: ["User"],
    }),
    AddRole: builder.mutation<string, AddRoleDto>({
      query: (dto) => ({
        url: "Account/AddRole",
        method: "POST",
        body: dto,
      }),
      transformResponse: (response: ApiResponse<null>) => response.message,
    }),
    RevokeToken: builder.mutation<ApiResponse<void>, RevokeToken | void>({
      query: (body) => ({
        url: "Account/RevokeToken",
        method: "POST",
        body: body ?? {},
      }),
      invalidatesTags: ["User"],
    }),
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
  useGetUserInfoQuery,
  useGetRolesQuery,
  useUpdateProfileMutation,
  useAddRoleMutation,
  useRevokeTokenMutation,
  useRefreshTokenMutation,
} = authApi;
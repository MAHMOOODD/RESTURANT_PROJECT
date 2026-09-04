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
  FiltersUsers,
  PagedResponse,
} from "@/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export interface GetUserInfo {
  id: string; 
  fullName?: string;
  address?: string;
  phoneNumber?: string;
  userName: string;
  email: string;
  imageUrl?: string;
  roles: string[];
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

    GetAllUsers: builder.query<PagedResponse<GetUserInfo>, FiltersUsers>({
      query: (filters) => {
     
        const params = new URLSearchParams();

        if (filters.pagination?.pageNumber !== undefined) {
          params.set("pagination.pageNumber", String(filters.pagination.pageNumber));
        }
        if (filters.pagination?.pageSize !== undefined) {
          params.set("pagination.pageSize", String(filters.pagination.pageSize));
        }
        if (filters.searchTerm) {
          params.set("searchTerm", filters.searchTerm);
        }
      
        if (filters.sortByUsername !== undefined) {
          params.set("userName", String(filters.sortByUsername));
        }
        if (filters.ascending !== undefined) {
          params.set("ascending", String(filters.ascending));
        }

        return {
          url: `User/GetAllUsers?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: ApiResponse<PagedResponse<GetUserInfo>>) =>
        response.data,
      providesTags: ["User"],
    }),
    GetUserById: builder.query<GetUserInfo, string>({
      query: (userId) => `User/GetUserbyId/${userId}`,
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
      invalidatesTags: ["User"], 
    }),
    RemoveRole: builder.mutation<string, AddRoleDto>({
      query: (dto) => ({
        url: "Account/RemoveRole",
        method: "POST",
        body: dto,
      }),
      transformResponse: (response: ApiResponse<null>) => response.message,
      invalidatesTags: ["User"],
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
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateProfileMutation,
  useAddRoleMutation,
  useRemoveRoleMutation,
  useRevokeTokenMutation,
  useRefreshTokenMutation,
} = authApi;
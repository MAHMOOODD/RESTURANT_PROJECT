// services/authApi.ts
import { baseQuery } from "@/services/baseQuery";
import {
  type ResetPasswordDto,
  type ForgetPasswordDto,
  type RegisterModel,
  type ResponseLogin,
  type ResponseRegister,
  type TokenRequestModel,
  type ConfirmEmailDto,
} from "@/store/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery(),
  
  endpoints: (builder) => ({
    Login: builder.mutation<ResponseLogin, TokenRequestModel>({
      query: (credentials) => ({
        url: "Account/Login",
        method: "POST",
        body: credentials,
      }),
    }),
    Register: builder.mutation<ResponseRegister, RegisterModel>({
      query: (credentials) => ({
        url: "Account/Register",
        method: "POST",
        body: credentials,
      }),
    }),
    ForgetPassword :builder.mutation<void,ForgetPasswordDto>({
      query : (credentials) => ({
        url: "Account/ForgetPassword",
        method: "POST",
        body: credentials,
      })
    }),
    ResetPassword: builder.mutation<void ,ResetPasswordDto>({
      query : (credentials) =>( {
        url : "Account/ResetPassword",
        method : "POST",
        body : credentials
      })
    }),
    ConfirmEmail: builder.mutation<void ,ConfirmEmailDto>({
      query : (credentials) =>( {
        url : "Account/ConfirmEmail",
        method : "GET",
        params : credentials
        
      })
    }),
   
  }),
});


export const { useLoginMutation, useRegisterMutation, useForgetPasswordMutation , useConfirmEmailMutation , useResetPasswordMutation } = authApi;

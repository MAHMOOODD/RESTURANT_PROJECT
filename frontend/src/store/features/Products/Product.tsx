// services/authApi.ts
import { baseQuery } from "@/services/baseQuery";
import {
  type ResponseLogin,
  type TokenRequestModel,
} from "@/store/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: baseQuery(),
  
  endpoints: (builder) => ({
    Login: builder.mutation<ResponseLogin, TokenRequestModel>({
      query: (credentials) => ({
        url: "Account/Login",
        method: "POST",
        body: credentials,
      }),
    }),
  
  
   
  
   
  }),
});


export const { useLoginMutation} = productApi;

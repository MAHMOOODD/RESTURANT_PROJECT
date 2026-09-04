import { baseQuery } from "@/services/baseQuery";
import type { ApiResponse, InitiatePaymentResponseDto } from "@/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQuery(),
  tagTypes: ["Payment"],

  endpoints: (builder) => ({
    // POST: /api/Payment/initiate/{orderId}
    initiatePayment: builder.mutation<InitiatePaymentResponseDto, number>({
      query: (orderId) => ({
        url: `/Payment/initiate/${orderId}`,
        method: "POST",
      }),

      transformResponse: (response: ApiResponse<InitiatePaymentResponseDto>) =>
        response.data,
    }),
  }),
});

export const { useInitiatePaymentMutation } = paymentApi;
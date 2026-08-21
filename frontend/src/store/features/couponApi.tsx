import { baseQuery } from "@/services/baseQuery";
import type {
  ApiResponse,
  GetCouponDto,
  AddCouponDto,
  EditCouponDto,
} from "@/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const couponApi = createApi({
  reducerPath: "couponApi",
  baseQuery: baseQuery(),
  tagTypes: ["Coupons"],
  endpoints: (builder) => ({
    // GET: /api/Coupon
    getAllCoupons: builder.query<GetCouponDto[], void>({
      query: () => ({
        url: "/Coupon",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetCouponDto[]>) => response.data,
      providesTags: ["Coupons"],
    }),

    // GET: /api/Coupon/{id}
    getCouponById: builder.query<GetCouponDto, number>({
      query: (id) => ({
        url: `/Coupon/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetCouponDto>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Coupons", id }],
    }),

    // POST: /api/Coupon/Add
    addCoupon: builder.mutation<GetCouponDto, AddCouponDto>({
      query: (dto) => ({
        url: "/Coupon/Add",
        method: "POST",
        body: dto,
      }),
      transformResponse: (response: ApiResponse<GetCouponDto>) => response.data,
      invalidatesTags: ["Coupons"],
    }),

    // PUT: /api/Coupon/Edit/{id}
    editCoupon: builder.mutation<
      GetCouponDto,
      { id: number; dto: EditCouponDto }
    >({
      query: ({ id, dto }) => ({
        url: `/Coupon/Edit/${id}`,
        method: "PUT",
        body: dto,
      }),
      transformResponse: (response: ApiResponse<GetCouponDto>) => response.data,
      invalidatesTags: ["Coupons"],
    }),

    // DELETE: /api/Coupon/{id}
    deleteCoupon: builder.mutation<string, number>({
      query: (id) => ({
        url: `/Coupon/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<null>) => response.message,
      invalidatesTags: ["Coupons"],
    }),

    // POST: /api/Coupon/Validate
    validateCoupon: builder.mutation<
      { message: string; discount: number },
      { code: string; amount: number }
    >({
      query: ({ code, amount }) => ({
        url: "/Coupon/Validate",
        method: "POST",
        params: { code, Amount: amount },
      }),
      transformResponse: (
        response: ApiResponse<{ message: string; discount: number }>
      ) => response.data,
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useGetCouponByIdQuery,
  useAddCouponMutation,
  useEditCouponMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation,
} = couponApi;
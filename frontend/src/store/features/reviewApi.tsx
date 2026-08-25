import { baseQuery } from "@/services/baseQuery";
import type {
  ApiResponse,
  GetReviewDto,
  AddReviewDto,
  EditReviewDto,
} from "@/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: baseQuery(),
  tagTypes: ["Reviews", "Products"],
  endpoints: (builder) => ({
    // GET: /api/Review/Get/{ProductId}
    getReviewsByProductId: builder.query<GetReviewDto[], number>({
      query: (productId) => ({
        url: `/Review/Get/${productId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetReviewDto[]>) =>
        response.data,
      providesTags: (_result, _error, productId) => [
        { type: "Reviews", id: productId },
        { type: "Reviews", id: "LIST" },
      ],
    }),

    getTop10Reviews: builder.query<GetReviewDto[], void>({
      query: () => ({
        url: `/Review/GetTop10`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetReviewDto[]>) =>
        response.data,
      providesTags: [{ type: "Reviews", id: "TOP_10" }],
    }),

    // GET: /api/Review/getById/{id}
    getReviewById: builder.query<GetReviewDto, number>({
      query: (id) => ({
        url: `/Review/getById/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetReviewDto>) =>
        response.data,
      providesTags: (_result, _error, id) => [{ type: "Reviews", id }],
    }),

    // POST: /api/Review/Add
    addReview: builder.mutation<GetReviewDto, AddReviewDto>({
      query: (dto) => ({
        url: "/Review/Add",
        method: "POST",
        body: dto,
      }),
      transformResponse: (response: ApiResponse<GetReviewDto>) =>
        response.data,
      invalidatesTags: (_result, _error, arg) => [
        { type: "Reviews", id: arg.productId },
        { type: "Reviews", id: "TOP_10" },
        { type: "Products", id: arg.productId }, // إجبار صفحة تفاصيل المنتج على إعادة الجلب فوراً
      ],
    }),

    // PUT: /api/Review/{id}
    editReview: builder.mutation<
      GetReviewDto,
      { id: number; dto: EditReviewDto }
    >({
      query: ({ id, dto }) => ({
        url: `/Review/${id}`,
        method: "PUT",
        body: dto,
      }),
      transformResponse: (response: ApiResponse<GetReviewDto>) =>
        response.data,
      invalidatesTags: (_result, _error, arg) => [
        { type: "Reviews", id: arg.dto.productId },
        { type: "Reviews", id: "TOP_10" },
        { type: "Products", id: arg.dto.productId }, // تحديث المنتج وتقييماته فوراً عند التعديل
      ],
    }),

    // DELETE: /api/Review/{id}
    deleteReview: builder.mutation<string, { id: number; productId?: number }>({
      query: ({ id }) => ({
        url: `/Review/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<null>) => response.message,
      invalidatesTags: (_result, _error, arg) => [
        { type: "Reviews", id: "TOP_10" },
        ...(arg.productId
          ? [
              { type: "Reviews" as const, id: arg.productId },
              { type: "Products" as const, id: arg.productId }, // تحديث المنتج فوراً عند الحذف
            ]
          : [{ type: "Reviews" as const, id: "LIST" }]),
      ],
    }),
  }),
});

export const {
  useGetReviewsByProductIdQuery,
  useGetReviewByIdQuery,
  useGetTop10ReviewsQuery,
  useAddReviewMutation,
  useEditReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
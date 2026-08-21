import { baseQuery } from "@/services/baseQuery";
import type {
  ApiResponse,
  AddOrderDto,
  GetOrderDto,
  ResponseAddDto,
  StatusResponseDto,
} from "@/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQuery(),
  tagTypes: ["Orders", "Cart"],
  endpoints: (builder) => ({
    // POST: /api/Order/Add
    addOrder: builder.mutation<ResponseAddDto, AddOrderDto>({
      query: (dto) => ({
        url: "/Order/Add",
        method: "POST",
        body: dto,
      }),
      transformResponse: (response: ApiResponse<ResponseAddDto>) =>
        response.data,
      invalidatesTags: ["Orders", "Cart"],
    }),

    // GET: /api/Order/MyOrders
    getMyOrders: builder.query<GetOrderDto[], void>({
      query: () => ({
        url: "/Order/MyOrders",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetOrderDto[]>) => response.data,
      providesTags: ["Orders"],
    }),

    // GET: /api/Order/Get/{id}
    getOrderById: builder.query<GetOrderDto, number>({
      query: (id) => ({
        url: `/Order/Get${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetOrderDto>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Orders", id }],
    }),

    // GET: /api/Order/Get (All Orders - Admin/Manager)
    getAllOrders: builder.query<GetOrderDto[], void>({
      query: () => ({
        url: "/Order/Get",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetOrderDto[]>) => response.data,
      providesTags: ["Orders"],
    }),

    // PUT: /api/Order/{id}/status
    updateOrderStatus: builder.mutation<
      GetOrderDto,
      { id: number; dto: StatusResponseDto }
    >({
      query: ({ id, dto }) => ({
        url: `/Order/${id}/status`,
        method: "PUT",
        body: dto,
      }),
      transformResponse: (response: ApiResponse<GetOrderDto>) => response.data,
      invalidatesTags: (_result, _error, arg) => [{ type: "Orders", id: arg.id }, "Orders"],
    }),
  }),
});

export const {
  useAddOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
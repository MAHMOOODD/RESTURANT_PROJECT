import { baseQuery } from "@/services/baseQuery";
import type {
  ApiResponse,
  AddOrderDto,
  GetOrderDto,
  ResponseAddDto,
  StatusResponseDto,
} from "@/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { cartApi } from "./cartApi";
import type{ PagedResponse ,OrderFilter } from "@/types/types";
const buildFilterParams = (filter?: OrderFilter) => {
  if (!filter) return {};
  return {
    ...(filter.pagination?.pageNumber && {
      "Pagination.PageNumber": filter.pagination.pageNumber,
    }),
    ...(filter.pagination?.pageSize && {
      "Pagination.PageSize": filter.pagination.pageSize,
    }),
    ...(filter.searchTerm && {
      SearchTerm: filter.searchTerm,
    }),
    ...(filter.sortByPrice !== undefined && {
      SortByPrice: filter.sortByPrice,
    }),
    ...(filter.sortByDate !== undefined && {
      SortByDate: filter.sortByDate,
    }),
    ...(filter.ascending !== undefined && { Ascending: filter.ascending }),
    ...(filter.status !== undefined && { OrderStatus: filter.status }),
    ...(filter.paymentStatus !== undefined && {
      PaymentState: filter.paymentStatus,
    }),
  };
};
export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQuery(),
  tagTypes: ["Orders"],

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

      invalidatesTags: ["Orders"],

      async onQueryStarted(_dto, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(
            cartApi.util.invalidateTags(["Cart"])
          );
        } catch {
          // Order failed → don't invalidate cart
        }
      },
    }),

    // GET: /api/Order/MyOrders
    getMyOrders: builder.query<GetOrderDto[], void>({
      query: () => ({
        url: "/Order/MyOrders",
        method: "GET",
      }),

      transformResponse: (response: ApiResponse<GetOrderDto[]>) =>
        response.data,

      providesTags: ["Orders"],
    }),

    // GET: /api/Order/Get/{id}
    getOrderById: builder.query<GetOrderDto, number>({
      query: (id) => ({
        url: `/Order/Get/${id}`,
        method: "GET",
      }),

      transformResponse: (response: ApiResponse<GetOrderDto>) =>
        response.data,

      providesTags: (_result, _error, id) => [
        { type: "Orders", id },
      ],
    }),

    // GET: /api/Order/Get
    // GET: /api/Order/Get
    getAllOrders: builder.query<PagedResponse<GetOrderDto>, OrderFilter | void>({
      query: (OrderFilter) => ({
        url: "/Order/Get",
        method: "GET",
        params: buildFilterParams(OrderFilter || undefined),
      }),

      transformResponse: (response: ApiResponse<PagedResponse<GetOrderDto>>) =>
        response.data,

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

      transformResponse: (response: ApiResponse<GetOrderDto>) =>
        response.data,

      invalidatesTags: (_result, _error, arg) => [
        { type: "Orders", id: arg.id },
        "Orders",
      ],
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
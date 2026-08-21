import { baseQuery } from "@/services/baseQuery";
import type {
  ApiResponse,
  GetCartDto,
  EditCartItemDto,
  AddToCartDto,
  
} from "@/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: baseQuery(),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    // GET: /api/Cart/GetCart
    getCart: builder.query<GetCartDto[], void>({
      query: () => ({
        url: "/Cart/GetCart",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetCartDto[]>) => response.data,
      providesTags: ["Cart"],
    }),

    // POST: /api/Cart/AddToCart/{productId}
    addToCart: builder.mutation<
      AddToCartDto,
      { productId: number; dto: EditCartItemDto }
    >({
      query: ({ productId, dto }) => ({
        url: `/Cart/AddToCart/${productId}`,
        method: "POST",
        body: dto,
      }),
      transformResponse: (response: ApiResponse<AddToCartDto>) => response.data,
      invalidatesTags: ["Cart"],
    }),

    // PUT: /api/Cart/EditCartItem/{cartItemId}
    editCartItem: builder.mutation<
      EditCartItemDto,
      { cartItemId: number; dto: EditCartItemDto }
    >({
      query: ({ cartItemId, dto }) => ({
        url: `/Cart/EditCartItem/${cartItemId}`,
        method: "PUT",
        body: dto,
      }),
      transformResponse: (response: ApiResponse<EditCartItemDto>) => response.data,
      invalidatesTags: ["Cart"],
    }),

    // DELETE: /api/Cart/DeleteCartItem/{cartItemId}
    deleteCartItem: builder.mutation<string, number>({
      query: (cartItemId) => ({
        url: `/Cart/DeleteCartItem/${cartItemId}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<null>) => response.message,
      invalidatesTags: ["Cart"],
    }),

    // DELETE: /api/Cart/ClearCart
    clearCart: builder.mutation<string, void>({
      query: () => ({
        url: "/Cart/ClearCart",
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<null>) => response.message,
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useEditCartItemMutation,
  useDeleteCartItemMutation,
  useClearCartMutation,
} = cartApi;
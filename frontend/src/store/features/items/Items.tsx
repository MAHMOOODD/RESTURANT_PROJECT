import { baseQuery } from "@/services/baseQuery";
import {
  type ApiResponse,
  type PagedResponse,
  type GetCategoriesDto,
  type GetProductDto,
  type Filter,
  type GetAllProductDto,
} from "@/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";

// دالة مساعدة لتحويل الفلاتر إلى Params متوافقة مع C# Query Binding
const buildFilterParams = (filter?: Filter) => {
  if (!filter) return {};
  return {
    ...(filter.pagination?.pageNumber && {
      "Pagination.PageNumber": filter.pagination.pageNumber,
    }),
    ...(filter.pagination?.pageSize && {
      "Pagination.PageSize": filter.pagination.pageSize,
    }),
    ...(filter.sortByPrice !== undefined && {
      SortByPrice: filter.sortByPrice,
    }),
    ...(filter.sortBySelling !== undefined && {
      SortBySelling: filter.sortBySelling,
    }),
    ...(filter.ascending !== undefined && { Ascending: filter.ascending }),
  };
};

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: baseQuery(),

  endpoints: (builder) => ({
    // 1. Get All Products
    getAllProducts: builder.query<PagedResponse<GetAllProductDto>, Filter | void>({
      query: (filter) => ({
        url: "/Product/GetAll",
        method: "GET",
        params: buildFilterParams(filter || undefined),
      }),
      transformResponse: (
        response: ApiResponse<PagedResponse<GetAllProductDto>>,
      ) => response.data,
    }),

    // 2. Get Product By Id
    getProductById: builder.query<GetProductDto, number>({
      query: (id) => ({
        url: `/Product/GetById/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetProductDto>) =>
        response.data,
    }),

    // 3. Get Products By Name
    getProductByName: builder.query<
      PagedResponse<GetAllProductDto>,
      { name: string; filter?: Filter }
    >({
      query: ({ name, filter }) => ({
        url: "/Product/GetProductByName",
        method: "GET",
        params: {
          name,
          ...buildFilterParams(filter),
        },
      }),
      transformResponse: (
        response: ApiResponse<PagedResponse<GetAllProductDto>>,
      ) => response.data,
    }),

    // 4. Get Products By Category
    getProductByCategory: builder.query<
      PagedResponse<GetAllProductDto>,
      { categoryName: string; filter?: Filter }
    >({
      query: ({ categoryName, filter }) => ({
        url: "/Product/GetProductByCategory",
        method: "GET",
        params: {
          categoryName,
          ...buildFilterParams(filter),
        },
      }),
      transformResponse: (
        response: ApiResponse<PagedResponse<GetAllProductDto>>,
      ) => response.data,
    }),

    // 5. Get All Categories
    getAllCategories: builder.query<GetCategoriesDto[], void>({
      query: () => ({
        url: "/Categories/GetAll",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetCategoriesDto[]>) =>
        response.data,
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetProductByNameQuery,
  useGetProductByCategoryQuery,
  useGetAllCategoriesQuery,
} = productApi;

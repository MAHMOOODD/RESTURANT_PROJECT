import { baseQuery } from "@/services/baseQuery";
import type {
  ApiResponse,
  PagedResponse,
  GetCategoriesDto,
  AddCategoriesDto,
  EditCategoriesDto,
  GetProductDto,
  AddProductDto,
  EditProductDto,
  Filter,
  GetAllProductDto,
} from "@/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";

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
  tagTypes: ["Products", "Categories"],

  endpoints: (builder) => ({
    // 1. Get All Products
    getAllProducts: builder.query<
      PagedResponse<GetAllProductDto>,
      Filter | void
    >({
      query: (filter) => ({
        url: "/Product/GetAll",
        method: "GET",
        params: buildFilterParams(filter || undefined),
      }),
      transformResponse: (
        response: ApiResponse<PagedResponse<GetAllProductDto>>
      ) => response.data,
      providesTags: ["Products"],
    }),

    // 2. Get Product By Id
    getProductById: builder.query<GetProductDto, number>({
      query: (id) => ({
        url: `/Product/GetById/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetProductDto>) =>
        response.data,
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
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
        response: ApiResponse<PagedResponse<GetAllProductDto>>
      ) => response.data,
      providesTags: ["Products"],
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
        response: ApiResponse<PagedResponse<GetAllProductDto>>
      ) => response.data,
      providesTags: ["Products"],
    }),

    // 5. Get Products By CategoryId
    getProductByCategoryId: builder.query<
      PagedResponse<GetAllProductDto>,
      { categoryId: number; filter?: Filter }
    >({
      query: ({ categoryId, filter }) => ({
        url: "/Product/GetProductByCategoryId",
        method: "GET",
        params: {
          categoryId,
          ...buildFilterParams(filter),
        },
      }),
      transformResponse: (
        response: ApiResponse<PagedResponse<GetAllProductDto>>
      ) => response.data,
      providesTags: ["Products"],
    }),

    // 6. Add Product
    addProduct: builder.mutation<GetProductDto, AddProductDto>({
      query: (dto) => ({
        url: "/Product/Add",
        method: "POST",
        body: dto,
      }),
      transformResponse: (response: ApiResponse<GetProductDto>) =>
        response.data,
      invalidatesTags: ["Products"],
    }),

    // 7. Edit Product
    editProduct: builder.mutation<
      GetProductDto,
      { id: number; dto: EditProductDto }
    >({
      query: ({ id, dto }) => ({
        url: `/Product/Edit/${id}`,
        method: "PUT",
        body: dto,
      }),
      transformResponse: (response: ApiResponse<GetProductDto>) =>
        response.data,
      invalidatesTags: (_result, _error, arg) => [
        { type: "Products", id: arg.id },
        "Products",
      ],
    }),

    // 8. Delete Product
    deleteProduct: builder.mutation<string, number>({
      query: (id) => ({
        url: `/Product/Delete/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<null>) => response.message,
      invalidatesTags: ["Products"],
    }),

    // ============ CATEGORIES ENDPOINTS ============

    // 9. Get All Categories
    getAllCategories: builder.query<GetCategoriesDto[], void>({
      query: () => ({
        url: "/Categories/GetAll",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetCategoriesDto[]>) =>
        response.data,
      providesTags: ["Categories"],
    }),

    // 10. Get Category By Id
    getCategoryById: builder.query<GetCategoriesDto, number>({
      query: (id) => ({
        url: `/Categories/GetById/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetCategoriesDto>) =>
        response.data,
      providesTags: (_result, _error, id) => [{ type: "Categories", id }],
    }),

    // 11. Add Category
    addCategory: builder.mutation<GetCategoriesDto, AddCategoriesDto>({
      query: (dto) => ({
        url: "/Categories/Add",
        method: "POST",
        body: dto,
      }),
      transformResponse: (response: ApiResponse<GetCategoriesDto>) =>
        response.data,
      invalidatesTags: ["Categories"],
    }),

    // 12. Edit Category
    editCategory: builder.mutation<
      GetCategoriesDto,
      { id: number; dto: EditCategoriesDto }
    >({
      query: ({ id, dto }) => ({
        url: `/Categories/Edit/${id}`,
        method: "PUT",
        body: dto,
      }),
      transformResponse: (response: ApiResponse<GetCategoriesDto>) =>
        response.data,
      invalidatesTags: (_result, _error, arg) => [
        { type: "Categories", id: arg.id },
        "Categories",
      ],
    }),

    // 13. Delete Category
    deleteCategory: builder.mutation<string, number>({
      query: (id) => ({
        url: `/Categories/Delete/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<null>) => response.message,
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetProductByNameQuery,
  useGetProductByCategoryQuery,
  useGetProductByCategoryIdQuery,
  useAddProductMutation,
  useEditProductMutation,
  useDeleteProductMutation,
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useAddCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
} = productApi;
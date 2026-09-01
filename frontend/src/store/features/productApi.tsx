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
    ...(filter.searchTerm && { SearchTerm: filter.searchTerm }),
    ...(filter.sortByPrice !== undefined && {
      SortByPrice: filter.sortByPrice,
    }),
    ...(filter.sortBySelling !== undefined && {
      SortBySelling: filter.sortBySelling,
    }),
    ...(filter.ascending !== undefined && { Ascending: filter.ascending }),
    ...(filter.minPrice !== undefined && { MinPrice: filter.minPrice }),
    ...(filter.maxPrice !== undefined && { MaxPrice: filter.maxPrice }),
  };
};

// 1. تعريف الـ Types بوضوح (يا اما منتج يا اما كاتيجوري من ملفات التايبس)
type ProductDtoType = AddProductDto | EditProductDto;
type CategoryDtoType = AddCategoriesDto | EditCategoriesDto;
type AppDto = ProductDtoType | CategoryDtoType;

// 2. دالة بناء الـ FormData باستخدام الـ Type Narrowing الآمن تماماً
const createFormDataFromDto = (dto: AppDto): FormData => {
  const formData = new FormData();

  // التحقق الذكي: لو الكائن يحتوي على price فهو بالتأكيد "منتج"
  if ("price" in dto) {
    formData.append("Name", dto.name);
    formData.append("NameAr", dto.nameAr);
    formData.append("Description", dto.description);
    formData.append("DescriptionAr", dto.descriptionAr);
    formData.append("Price", String(dto.price));
    formData.append("PreparingTime", String(dto.preparingTime));
    formData.append("CategoryId", String(dto.categoryId));
    formData.append("IsAvailable", String(dto.isAvailable));
  } else {
    // غير ذلك فهو بالتأكيد "كاتيجوري"
    formData.append("Name", dto.name);
    formData.append("NameAr", dto.nameAr);
  }

  // معالجة الصورة المشتركة بين الاثنين
  if (dto.imageUrl instanceof File) {
    formData.append("ImageUrl", dto.imageUrl, dto.imageUrl.name);
  } else if (dto.imageUrl === null) {
    const emptyFile = new File([""], "delete_image.png", { type: "" });
    formData.append("ImageUrl", emptyFile);
  }

  return formData;
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
        response: ApiResponse<PagedResponse<GetAllProductDto>>,
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
        response: ApiResponse<PagedResponse<GetAllProductDto>>,
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
        response: ApiResponse<PagedResponse<GetAllProductDto>>,
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
        response: ApiResponse<PagedResponse<GetAllProductDto>>,
      ) => response.data,
      providesTags: ["Products"],
    }),

    // 6. Add Product
    addProduct: builder.mutation<GetProductDto, AddProductDto>({
      query: (dto) => ({
        url: "/Product/Add",
        method: "POST",
        body: createFormDataFromDto(dto),
      }),
      transformResponse: (response: ApiResponse<GetProductDto>) =>
        response.data,
      invalidatesTags: ["Products",],
    }),

    // 7. Edit Product
    editProduct: builder.mutation<
      GetProductDto,
      { id: number; dto: EditProductDto }
    >({
      query: ({ id, dto }) => ({
        url: `/Product/Edit/${id}`,
        method: "PUT",
        body: createFormDataFromDto(dto),
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

    getAllCategories: builder.query<GetCategoriesDto[], void>({
      query: () => ({
        url: "/Categories/GetAll",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetCategoriesDto[]>) =>
        response.data,
      providesTags: ["Categories"],
    }),

    getCategoryById: builder.query<GetCategoriesDto, number>({
      query: (id) => ({
        url: `/Categories/GetById/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<GetCategoriesDto>) =>
        response.data,
      providesTags: (_result, _error, id) => [{ type: "Categories", id }],
    }),

    // 9. Add Category
    addCategory: builder.mutation<GetCategoriesDto, AddCategoriesDto>({
      query: (dto) => ({
        url: "/Categories/Add",
        method: "POST",
        body: createFormDataFromDto(dto),
      }),
      transformResponse: (response: ApiResponse<GetCategoriesDto>) =>
        response.data,
      invalidatesTags: ["Categories"],
    }),

    // 10. Edit Category
    editCategory: builder.mutation<
      GetCategoriesDto,
      { id: number; dto: EditCategoriesDto }
    >({
      query: ({ id, dto }) => ({
        url: `/Categories/Edit/${id}`,
        method: "PUT",
        body: createFormDataFromDto(dto),
      }),
      transformResponse: (response: ApiResponse<GetCategoriesDto>) =>
        response.data,
      invalidatesTags: (_result, _error, arg) => [
        { type: "Categories", id: arg.id },
        "Categories",
      ],
    }),

    // 11. Delete Category
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
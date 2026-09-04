// src/store/features/dashboardApi.tsx
import { baseQuery } from "@/services/baseQuery";
import type { ApiResponse, DashboardOverviewDto } from "@/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQuery(),
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    // GET: /api/Dashboard/Overview?trendDays=14
    getDashboardOverview: builder.query<
      DashboardOverviewDto,
      { trendDays?: number } | void
    >({
      query: (args) => ({
        url: "/Dashboard/Overview",
        method: "GET",
       
        params: args?.trendDays ? { trendDays: args.trendDays } : undefined,
      }),
      transformResponse: (response: ApiResponse<DashboardOverviewDto>) =>
        response.data,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardOverviewQuery } = dashboardApi;

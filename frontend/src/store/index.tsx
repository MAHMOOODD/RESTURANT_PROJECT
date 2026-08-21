import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/User/authSlice";
import { authApi } from "@/store/features/User/Auth";
import { productApi } from "@/store/features/productApi";
import { cartApi } from "@/store/features/cartApi";
import { reviewApi } from "@/store/features/reviewApi";
import { orderApi } from "@/store/features/orderApi";
import { couponApi } from "@/store/features/couponApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productApi.middleware,
      cartApi.middleware,
      reviewApi.middleware,
      orderApi.middleware,
      couponApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
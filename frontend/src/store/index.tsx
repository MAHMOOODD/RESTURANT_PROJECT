import { configureStore, type Middleware } from "@reduxjs/toolkit";
import authReducer, { setCredentials, logout } from "./features/User/authSlice";
import { authApi } from "@/store/features/User/Auth";
import { productApi } from "@/store/features/productApi";
import { cartApi } from "@/store/features/cartApi";
import { reviewApi } from "@/store/features/reviewApi";
import { orderApi } from "@/store/features/orderApi";
import { couponApi } from "@/store/features/couponApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import notificationsReducer from "./features/notificationsSlice";
import { addOrderNotification } from "./features/notificationsSlice";import {
  orderHubConnection,
  startOrderHubConnection,
  stopOrderHubConnection,
  playNotificationSound,
} from "@/services/signalr";
import type { GetOrderDto } from "@/types/types";
import { dashboardApi } from "./features/dashboardApi";
import { paymentApi } from "./features/paymentApi";

const signalRMiddleware: Middleware = () => (next) => (action) => {
  if (setCredentials.match(action)) {
    startOrderHubConnection();
  }
  if (logout.match(action)) {
    stopOrderHubConnection();
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
      notifications: notificationsReducer,

    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productApi.middleware,
      cartApi.middleware,
      paymentApi.middleware,
      reviewApi.middleware,
      orderApi.middleware,
      couponApi.middleware,
      dashboardApi.middleware,
      signalRMiddleware
    ),
});

setupListeners(store.dispatch);
orderHubConnection.off("OrderStatusUpdated");

orderHubConnection.on("OrderStatusUpdated", (updatedOrder: GetOrderDto) => {
  store.dispatch(orderApi.util.invalidateTags(["Orders"]));
  store.dispatch(addOrderNotification(updatedOrder));  
  playNotificationSound();
});

orderHubConnection.onreconnected(() => {
  store.dispatch(orderApi.util.invalidateTags(["Orders"]));
});

if (store.getState().auth.token) {
  startOrderHubConnection();
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
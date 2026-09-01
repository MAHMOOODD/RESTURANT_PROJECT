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

// Middleware بيربط اتصال SignalR بحركة تسجيل الدخول/الخروج
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productApi.middleware,
      cartApi.middleware,
      reviewApi.middleware,
      orderApi.middleware,
      couponApi.middleware,
      dashboardApi.middleware,
      signalRMiddleware
    ),
});

setupListeners(store.dispatch);
orderHubConnection.off("OrderStatusUpdated");

// SignalR: تحديث فوري لكاش الأوردرز + صوت تنبيه لما حالة أي أوردر تتغير
orderHubConnection.on("OrderStatusUpdated", (updatedOrder: GetOrderDto) => {
  store.dispatch(orderApi.util.invalidateTags(["Orders"]));
  store.dispatch(addOrderNotification(updatedOrder)); // 👈 السطر الجديد
  playNotificationSound();
});

orderHubConnection.onreconnected(() => {
  store.dispatch(orderApi.util.invalidateTags(["Orders"]));
});

// لو فيه توكن محفوظ بالفعل (يعني اليوزر داخل من قبل وعمل ريفرش)، ابدأ الاتصال على طول
if (store.getState().auth.token) {
  startOrderHubConnection();
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
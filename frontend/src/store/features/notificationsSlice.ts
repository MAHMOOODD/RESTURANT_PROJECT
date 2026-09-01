import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GetOrderDto } from "@/types/types";

export interface OrderNotification {
  id: string;
  orderId: number;
  status: number;
  paymentStatus: number;
  receivedAt: string;
  read: boolean;
}

interface NotificationsState {
  items: OrderNotification[];
}

const initialState: NotificationsState = {
  items: [],
};

const MAX_NOTIFICATIONS = 30;

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addOrderNotification: (state, action: PayloadAction<GetOrderDto>) => {
      const order = action.payload;
      state.items.unshift({
        id: `${order.id}-${Date.now()}`,
        orderId: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        receivedAt: new Date().toISOString(),
        read: false,
      });
      if (state.items.length > MAX_NOTIFICATIONS) {
        state.items.length = MAX_NOTIFICATIONS;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.items.forEach((n) => {
        n.read = true;
      });
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const {
  addOrderNotification,
  markAllNotificationsAsRead,
  clearNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
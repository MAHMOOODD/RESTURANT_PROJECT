import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/User/Auth";
import { productApi } from "./features/items/Items";
import authReducer from "./features/User/authSlice";
// import userReducer from './features/user/userSlice';

export const store = configureStore({
  reducer: {
    // 1. ربط الـ API بالـ Store
    
    auth: authReducer,


    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  // 2. إضافة الـ Middleware عشان الـ Caching والـ Fetching يشتغلوا
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(productApi.middleware),
});

// استنتاج الـ types من الـ store نفسه
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

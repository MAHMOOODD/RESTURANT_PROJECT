import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './features/User/Auth';
// import userReducer from './features/user/userSlice';

export const store = configureStore({
  reducer: {
    // 1. ربط الـ API بالـ Store
    [authApi.reducerPath]: authApi.reducer,
  },
  // 2. إضافة الـ Middleware عشان الـ Caching والـ Fetching يشتغلوا
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

// استنتاج الـ types من الـ store نفسه
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
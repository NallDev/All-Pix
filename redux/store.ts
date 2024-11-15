import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/api/authApi";
import { pixabayApi } from "@/redux/slices/apiSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [pixabayApi.reducerPath]: pixabayApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, pixabayApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

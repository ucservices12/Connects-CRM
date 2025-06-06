// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import permissionReducer from './slices/permissionSlice';
import invoiceReducer from './slices/invoiceSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        permissions: permissionReducer,
        invoice: invoiceReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
